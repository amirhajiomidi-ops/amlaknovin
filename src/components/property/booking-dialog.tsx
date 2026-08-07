import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state";
import type { Property } from "@/data/properties";
import type { VisitBooking } from "@/data/tenant";
import { formatJalali } from "@/lib/format";
import { cn } from "@/lib/utils";

const SLOTS = [
  "۱۰:۰۰ تا ۱۱:۰۰",
  "۱۲:۰۰ تا ۱۳:۰۰",
  "۱۵:۰۰ تا ۱۶:۰۰",
  "۱۶:۳۰ تا ۱۷:۳۰",
  "۱۸:۰۰ تا ۱۹:۰۰",
];

export function BookingDialog({
  property,
  trigger,
}: {
  property: Property;
  trigger: ReactNode;
}) {
  const { user, addBooking } = useAppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string | null>(null);
  const [channel, setChannel] = useState<VisitBooking["channel"]>("حضوری");
  const [done, setDone] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const reset = () => {
    setDate(undefined);
    setSlot(null);
    setChannel("حضوری");
    setDone(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (next && !user) {
      toast.info("برای رزرو بازدید ابتدا وارد حساب کاربری شوید.");
      void navigate({ to: "/auth" });
      return;
    }
    setOpen(next);
    if (!next) setTimeout(reset, 200);
  };

  const submit = () => {
    if (!date || !slot) return;
    addBooking({
      propertyId: property.id,
      date: date.toISOString(),
      slot,
      channel,
    });
    setDone(true);
    toast.success("درخواست بازدید ثبت شد و برای مالک ارسال گردید.");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {done ? (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
            <DialogTitle className="text-lg">درخواست بازدید ثبت شد</DialogTitle>
            <DialogDescription>
              {date ? formatJalali(date) : ""} — {slot} ({channel})
              <br />
              پس از تأیید مالک، وضعیت در «بازدیدهای من» به‌روزرسانی می‌شود.
            </DialogDescription>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  setOpen(false);
                  void navigate({ to: "/tenant/bookings" });
                }}
              >
                مشاهده بازدیدهای من
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenChange(false)}
              >
                بستن
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>رزرو بازدید</DialogTitle>
              <DialogDescription>
                یک روز و بازه زمانی آزاد را انتخاب کنید؛ آدرس دقیق پس از تأیید
                مالک نمایش داده می‌شود.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>نوع بازدید</Label>
                <div className="flex gap-2">
                  <ChoiceChip
                    active={channel === "حضوری"}
                    onClick={() => setChannel("حضوری")}
                  >
                    <CalendarClock className="size-4" aria-hidden />
                    حضوری
                  </ChoiceChip>
                  {property.onlineTour ? (
                    <ChoiceChip
                      active={channel === "تور آنلاین"}
                      onClick={() => setChannel("تور آنلاین")}
                    >
                      <Video className="size-4" aria-hidden />
                      تور آنلاین
                    </ChoiceChip>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label>انتخاب روز</Label>
                <div className="rounded-xl border border-border p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < today}
                    className={cn("pointer-events-auto mx-auto")}
                  />
                </div>
                {date ? (
                  <p className="text-xs text-muted-foreground">
                    روز انتخابی: {formatJalali(date)}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>بازه زمانی</Label>
                <div className="flex flex-wrap gap-2">
                  {SLOTS.map((s) => (
                    <ChoiceChip
                      key={s}
                      active={slot === s}
                      onClick={() => setSlot(s)}
                    >
                      {s}
                    </ChoiceChip>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                className="w-full"
                disabled={!date || !slot}
                onClick={submit}
              >
                ثبت درخواست بازدید
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChoiceChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
