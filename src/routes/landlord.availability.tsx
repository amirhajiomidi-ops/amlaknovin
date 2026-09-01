import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { AvailabilityEditor } from "@/components/property/availability-editor";
import { useAppState } from "@/context/app-state";
import { dateKey, keyToDate, type DayAvailability } from "@/data/availability";
import { landlordPropertyIds } from "@/data/landlord";
import { getProperty } from "@/data/properties";
import { formatJalali, toFaDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/landlord/availability")({
  component: LandlordAvailability,
});

function LandlordAvailability() {
  const { availability, setPropertyAvailability, bookings } = useAppState();
  const [propertyId, setPropertyId] = useState(landlordPropertyIds[0]);

  const days: DayAvailability = availability[propertyId] ?? {};

  const bookedByDay = useMemo(() => {
    const map: Record<string, string[]> = {};
    bookings
      .filter((b) => b.propertyId === propertyId && b.status !== "cancelled")
      .forEach((b) => {
        const k = dateKey(b.date);
        map[k] = [...(map[k] ?? []), b.slot];
      });
    return map;
  }, [bookings, propertyId]);

  const totalSlots = Object.values(days).reduce((s, v) => s + v.length, 0);
  const bookedCount = Object.entries(days).reduce(
    (s, [k, v]) => s + v.filter((x) => (bookedByDay[k] ?? []).includes(x)).length,
    0,
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          تقویم بازدید آگهی‌ها
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          روزها و ساعت‌های آزاد بازدید هر آگهی را مشخص یا ویرایش کنید؛ همین
          زمان‌ها در صفحه آگهی به مستأجران نمایش داده می‌شود.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {landlordPropertyIds.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setPropertyId(id)}
            className={cn(
              "max-w-[220px] truncate rounded-lg border px-3 py-2 text-xs transition",
              id === propertyId
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground hover:bg-muted",
            )}
          >
            {getProperty(id)?.title ?? id}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="روزهای فعال" value={toFaDigits(Object.keys(days).length)} />
        <Stat label="بازه‌های اعلام‌شده" value={toFaDigits(totalSlots)} />
        <Stat
          label="بازه‌های رزروشده"
          value={toFaDigits(bookedCount)}
          tone="warning"
        />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <AvailabilityEditor
          value={days}
          onChange={(next) => setPropertyAvailability(propertyId, next)}
          bookedSlots={bookedByDay}
        />
      </div>

      <section className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarDays className="size-4 text-primary" aria-hidden />
          وضعیت روزها
        </div>
        {Object.keys(days).length === 0 ? (
          <p className="text-xs text-muted-foreground">
            برای این آگهی هنوز زمانی ثبت نشده است.
          </p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(days)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, slots]) => (
                <li key={k} className="rounded-xl border border-border bg-background p-3">
                  <div className="text-xs font-medium text-foreground">
                    {formatJalali(keyToDate(k))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {slots.map((s) => {
                      const taken = (bookedByDay[k] ?? []).includes(s);
                      return (
                        <span
                          key={s}
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[11px]",
                            taken
                              ? "bg-warning-soft text-warning"
                              : "bg-success-soft text-success",
                          )}
                        >
                          {s} — {taken ? "رزرو شده" : "خالی"}
                        </span>
                      );
                    })}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "warning";
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-1 text-xl font-bold",
          tone === "warning" ? "text-warning" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}
