import { Link } from "@tanstack/react-router";
import { toFaDigits } from "@/lib/format";

const columns = [
  {
    title: "معامله امن",
    links: [
      { label: "راهنمای رهن و اجاره", to: "/" },
      { label: "احراز فایل و مالک", to: "/" },
      { label: "پرداخت دو مرحله‌ای", to: "/" },
      { label: "قرارداد خودنویس", to: "/" },
    ],
  },
  {
    title: "برای مستأجر",
    links: [
      { label: "جست‌وجوی خانه", to: "/" },
      { label: "بازدیدهای من", to: "/" },
      { label: "پیشنهادهای من", to: "/" },
    ],
  },
  {
    title: "برای موجر",
    links: [
      { label: "ثبت ملک", to: "/" },
      { label: "داشبورد موجر", to: "/" },
      { label: "قوانین انتشار فایل", to: "/" },
    ],
  },
  {
    title: "پشتیبانی",
    links: [
      { label: "مرکز راهنما", to: "/" },
      { label: "تماس با ما", to: "/" },
      { label: "حریم خصوصی", to: "/" },
    ],
  },
] as const;

export function SiteFooter() {
  const year = toFaDigits(new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    timeZone: "Asia/Tehran",
  }).format(new Date()).replace(/[^0-9۰-۹]/g, ""));

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="app-container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold"
              >
                ا
              </span>
              <span className="text-lg font-bold text-foreground">املاک</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              مسیر امن رهن و اجاره مسکونی؛ از فایل تأییدشده تا قرارداد و تسویه.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {year} پلتفرم املاک — همه حقوق محفوظ است.</p>
          <p>ساخته‌شده برای معامله‌ای شفاف و امن.</p>
        </div>
      </div>
    </footer>
  );
}
