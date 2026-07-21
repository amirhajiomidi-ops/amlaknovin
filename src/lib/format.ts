// ابزارهای قالب‌بندی فارسی برای اعداد، مبالغ و تاریخ شمسی.
// همه‌جا از این توابع استفاده شود تا نمایش یکسان بماند.

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatTomans(amount: number): string {
  const withSeparators = new Intl.NumberFormat("en-US").format(amount);
  return `${toFaDigits(withSeparators)} تومان`;
}

export function formatCompactTomans(amount: number): string {
  if (amount >= 1_000_000_000) {
    const value = (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toFaDigits(value)} میلیارد تومان`;
  }
  if (amount >= 1_000_000) {
    const value = (amount / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toFaDigits(value)} میلیون تومان`;
  }
  return formatTomans(amount);
}

// تاریخ شمسی با منطقه زمانی تهران
export function formatJalali(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatJalaliTime(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
