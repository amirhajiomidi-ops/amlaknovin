// تقویم هوشمند بازدید: روزها و بازه‌های زمانی آزاد هر آگهی.

export const VISIT_SLOTS = [
  "۱۰:۰۰ تا ۱۱:۰۰",
  "۱۲:۰۰ تا ۱۳:۰۰",
  "۱۵:۰۰ تا ۱۶:۰۰",
  "۱۶:۳۰ تا ۱۷:۳۰",
  "۱۸:۰۰ تا ۱۹:۰۰",
] as const;

/** روز → لیست بازه‌های آزاد اعلام‌شده توسط موجر */
export type DayAvailability = Record<string, string[]>;
/** آگهی → تقویم بازدید */
export type AvailabilityMap = Record<string, DayAvailability>;

/** کلید روز به صورت YYYY-MM-DD (میلادی، محلی) */
export function dateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** تقویم پیش‌فرض نمونه برای آگهی‌های موجود (چند روز آینده) */
export function seedAvailability(propertyIds: readonly string[]): AvailabilityMap {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const map: AvailabilityMap = {};
  propertyIds.forEach((id, index) => {
    const days: DayAvailability = {};
    for (let i = 1; i <= 10; i += 1) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      if ((i + index) % 3 === 0) continue;
      const slots = VISIT_SLOTS.filter((_, s) => (s + i + index) % 2 === 0);
      if (slots.length > 0) days[dateKey(d)] = [...slots];
    }
    map[id] = days;
  });
  return map;
}
