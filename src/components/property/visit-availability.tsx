import { useEffect, useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";

import { useAppState } from "@/context/app-state";
import { dateKey, keyToDate } from "@/data/availability";
import type { Property } from "@/data/properties";
import { formatJalali, toFaDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** نمایش روزها و ساعت‌های بازدید اعلام‌شده توسط موجر در صفحه آگهی */
export function VisitAvailability({ property }: { property: Property }) {
  const { availability, bookings } = useAppState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const days = availability[property.id] ?? {};

  const bookedByDay = useMemo(() => {
    const map: Record<string, string[]> = {};
    bookings
      .filter((b) => b.propertyId === property.id && b.status !== "cancelled")
      .forEach((b) => {
        const k = dateKey(b.date);
        map[k] = [...(map[k] ?? []), b.slot];
      });
    return map;
  }, [bookings, property.id]);

  if (!mounted) return null;

  const entries = Object.entries(days)
    .filter(([, slots]) => slots.length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
        <CalendarRange className="size-4 text-primary" aria-hidden />
        زمان‌های بازدید
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          موجر هنوز زمان بازدیدی اعلام نکرده است.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map(([k, slots]) => (
            <li key={k}>
              <div className="text-[11px] text-muted-foreground">
                {formatJalali(keyToDate(k))}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {slots.map((s) => {
                  const taken = (bookedByDay[k] ?? []).includes(s);
                  return (
                    <span
                      key={s}
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px]",
                        taken
                          ? "bg-muted text-muted-foreground line-through"
                          : "bg-success-soft text-success",
                      )}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
      {Object.keys(days).length > entries.length ? (
        <p className="mt-2 text-[11px] text-muted-foreground">
          و {toFaDigits(Object.keys(days).length - entries.length)} روز دیگر در
          تقویم رزرو.
        </p>
      ) : null}
    </div>
  );
}
