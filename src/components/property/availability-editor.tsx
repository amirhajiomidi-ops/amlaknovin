import { useMemo, useState } from "react";
import { CalendarDays, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  VISIT_SLOTS,
  dateKey,
  keyToDate,
  type DayAvailability,
} from "@/data/availability";
import {
  faWeekdayShort,
  formatJalali,
  formatJalaliDay,
  formatJalaliMonth,
  toFaDigits,
} from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * تقویم هوشمند اعلام زمان‌های بازدید توسط موجر:
 * انتخاب روز → انتخاب بازه‌های زمانی آزاد همان روز.
 */
export function AvailabilityEditor({
  value,
  onChange,
  bookedSlots,
}: {
  value: DayAvailability;
  onChange: (next: DayAvailability) => void;
  /** روز → بازه‌های رزروشده (قابل حذف نیست) */
  bookedSlots?: Record<string, string[]>;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [selected, setSelected] = useState<Date | undefined>();

  const key = selected ? dateKey(selected) : null;
  const daySlots = key ? (value[key] ?? []) : [];
  const booked = key ? (bookedSlots?.[key] ?? []) : [];

  const activeDays = useMemo(
    () =>
      Object.entries(value)
        .filter(([, slots]) => slots.length > 0)
        .sort(([a], [b]) => a.localeCompare(b)),
    [value],
  );

  const toggleSlot = (slot: string) => {
    if (!key) return;
    const on = daySlots.includes(slot);
    if (on && booked.includes(slot)) return;
    const nextSlots = on
      ? daySlots.filter((s) => s !== slot)
      : [...daySlots, slot].sort(
          (a, b) => VISIT_SLOTS.indexOf(a as never) - VISIT_SLOTS.indexOf(b as never),
        );
    const next = { ...value };
    if (nextSlots.length === 0) delete next[key];
    else next[key] = nextSlots;
    onChange(next);
  };

  const clearDay = (dayKey: string) => {
    const next = { ...value };
    delete next[dayKey];
    onChange(next);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-background p-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          disabled={(d) => d < today}
          dir="rtl"
          weekStartsOn={6}
          modifiers={{
            hasSlots: (d) => (value[dateKey(d)]?.length ?? 0) > 0,
          }}
          modifiersClassNames={{
            hasSlots:
              "bg-primary-soft text-primary font-semibold rounded-md",
          }}
          formatters={{
            formatCaption: (m) => formatJalaliMonth(m),
            formatWeekdayName: (d) => faWeekdayShort(d),
            formatDay: (d) => formatJalaliDay(d),
          }}
          className={cn("pointer-events-auto mx-auto")}
        />
      </div>

      <div className="space-y-3">
        {selected ? (
          <>
            <div className="text-xs font-medium text-foreground">
              بازه‌های آزاد {formatJalali(selected)}
            </div>
            <div className="flex flex-wrap gap-2">
              {VISIT_SLOTS.map((s) => {
                const on = daySlots.includes(s);
                const isBooked = booked.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSlot(s)}
                    disabled={isBooked}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition",
                      isBooked
                        ? "cursor-not-allowed border-warning/40 bg-warning-soft text-warning"
                        : on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    {on ? <Check className="size-3.5" aria-hidden /> : null}
                    {s}
                    {isBooked ? " (رزرو شده)" : ""}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
            یک روز را از تقویم انتخاب کنید تا بازه‌های زمانی بازدید را مشخص کنید.
          </p>
        )}

        <div className="rounded-xl border border-border bg-surface p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
            <CalendarDays className="size-4 text-primary" aria-hidden />
            روزهای اعلام‌شده ({toFaDigits(activeDays.length)})
          </div>
          {activeDays.length === 0 ? (
            <p className="text-xs text-muted-foreground">هنوز روزی ثبت نشده است.</p>
          ) : (
            <ul className="space-y-2">
              {activeDays.map(([k, slots]) => (
                <li
                  key={k}
                  className="flex items-start justify-between gap-2 rounded-lg bg-background p-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground">
                      {formatJalali(keyToDate(k))}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {slots.map((s) => (
                        <span
                          key={s}
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[11px]",
                            bookedSlots?.[k]?.includes(s)
                              ? "bg-warning-soft text-warning"
                              : "bg-success-soft text-success",
                          )}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => clearDay(k)}
                    aria-label="حذف روز"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
