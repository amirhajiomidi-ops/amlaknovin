import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Eye, Handshake, Rocket } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/context/app-state";
import {
  landlordContracts,
  landlordOffers,
  landlordPropertyIds,
  landlordVisitRequests,
  listingStats,
} from "@/data/landlord";
import { getProperty } from "@/data/properties";
import { getPlan } from "@/data/promotions";
import { activePromo, daysLeft } from "@/lib/ranking";
import { formatJalali, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/landlord/")({
  component: LandlordOverview,
});

function LandlordOverview() {
  const { promotions } = useAppState();
  const totalViews = landlordPropertyIds.reduce(
    (s, id) => s + (listingStats[id]?.views ?? 0),
    0,
  );
  const pending = landlordVisitRequests.filter((v) => v.status === "pending");
  const openOffers = landlordOffers.filter((o) => o.status === "open");
  const activePlans = landlordPropertyIds.filter((id) =>
    activePromo(promotions, id),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Eye} label="بازدید آگهی‌ها" value={toFaDigits(totalViews)} />
        <Stat
          icon={CalendarClock}
          label="درخواست بازدید در انتظار"
          value={toFaDigits(pending.length)}
        />
        <Stat
          icon={Handshake}
          label="پیشنهاد باز"
          value={toFaDigits(openOffers.length)}
        />
        <Stat
          icon={Rocket}
          label="آگهی دارای طرح فعال"
          value={toFaDigits(activePlans.length)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              طرح‌های فعال ارتقا
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/landlord/properties">مدیریت آگهی‌ها</Link>
            </Button>
          </div>
          {activePlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              هنوز طرحی فعال نکرده‌اید. با ارتقای آگهی، دیده‌شدن آن چند برابر می‌شود.
            </p>
          ) : (
            <ul className="space-y-3">
              {activePlans.map((id) => {
                const promo = activePromo(promotions, id)!;
                const p = getProperty(id);
                return (
                  <li
                    key={id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">
                        {p?.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPlan(promo.planId).title} ·{" "}
                        {toFaDigits(daysLeft(promo.expiresAt))} روز باقی‌مانده
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-primary-soft px-2 py-1 text-[11px] font-semibold text-primary">
                      {getPlan(promo.planId).badgeLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            آخرین درخواست‌های بازدید
          </h2>
          <ul className="space-y-3">
            {landlordVisitRequests.slice(0, 3).map((v) => (
              <li
                key={v.id}
                className="rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {v.tenantName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatJalali(v.date)}
                  </span>
                </div>
                <div className="mt-1 truncate text-xs text-muted-foreground">
                  {getProperty(v.propertyId)?.title}
                </div>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/landlord/bookings">مشاهده همه بازدیدها</Link>
          </Button>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">قراردادها</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            {toFaDigits(landlordContracts.length)} قرارداد ثبت‌شده؛{" "}
            {toFaDigits(
              landlordContracts.filter((c) => c.status === "awaiting-landlord")
                .length,
            )}{" "}
            مورد در انتظار امضای شما.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/landlord/contracts">بررسی قراردادها</Link>
          </Button>
        </div>
        <AdSlot placement="panel-soft" size="inline" />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden />
        {label}
      </div>
      <div className="mt-2 text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}
