import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, MapPin, Video, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProperty } from "@/data/properties";
import {
  bookingStatusLabels,
  type BookingStatus,
  type VisitBooking,
} from "@/data/tenant";
import { formatJalali } from "@/lib/format";
import { useAppState } from "@/context/app-state";

export const Route = createFileRoute("/tenant/bookings")({
  head: () => ({
    meta: [
      { title: "بازدیدها — پنل مستأجر" },
      {
        name: "description",
        content: "مدیریت درخواست‌های بازدید حضوری و تور آنلاین ملک.",
      },
      { property: "og:title", content: "بازدیدها — پنل مستأجر" },
      {
        property: "og:description",
        content: "تأیید، جابه‌جایی و لغو بازدیدها با هماهنگی مستقیم مالک.",
      },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const { bookings: visitBookings } = useAppState();
  const upcoming = visitBookings.filter(
    (b) => b.status === "confirmed" || b.status === "requested",
  );
  const past = visitBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">بازدیدهای من</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          هماهنگی بازدید فقط از طریق پلتفرم انجام می‌شود تا سابقه معامله ثبت شود.
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            پیش‌رو ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">تاریخچه ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <EmptyBookings />
          ) : (
            upcoming.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4 space-y-3">
          {past.length === 0 ? (
            <EmptyBookings />
          ) : (
            past.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingCard({ booking }: { booking: VisitBooking }) {
  const p = getProperty(booking.propertyId);
  if (!p) return null;
  const canManage =
    booking.status === "confirmed" || booking.status === "requested";

  const tone: Record<BookingStatus, string> = {
    requested: "border-warning/30 bg-warning-soft text-warning",
    confirmed: "border-success/30 bg-success-soft text-success",
    completed: "border-border bg-muted text-muted-foreground",
    cancelled: "border-destructive/30 bg-destructive-soft text-destructive",
  };

  return (
    <Card>
      <CardContent className="flex flex-wrap items-start justify-between gap-4 p-4">
        <div className="flex flex-1 items-start gap-3">
          <img
            src={p.images[0]}
            alt=""
            className="size-20 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <Link
              to="/property/$id"
              params={{ id: p.id }}
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              {p.title}
            </Link>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden /> {p.approxLocation}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarClock className="size-3.5" aria-hidden />
                {formatJalali(booking.date)} — {booking.slot}
              </span>
              <span className="flex items-center gap-1">
                {booking.channel === "تور آنلاین" ? (
                  <Video className="size-3.5" aria-hidden />
                ) : (
                  <MapPin className="size-3.5" aria-hidden />
                )}
                {booking.channel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={tone[booking.status]}>
            {bookingStatusLabels[booking.status]}
          </Badge>
          {canManage && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">جابه‌جایی</Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <X className="size-4" aria-hidden /> لغو
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyBookings() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center">
      <CalendarClock className="mx-auto size-8 text-muted-foreground" aria-hidden />
      <p className="mt-2 text-sm text-muted-foreground">
        هنوز بازدیدی در این بخش ندارید.
      </p>
      <Button asChild className="mt-4">
        <Link to="/search">جست‌وجوی ملک</Link>
      </Button>
    </div>
  );
}
