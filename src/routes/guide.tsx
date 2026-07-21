import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  FileCheck2,
  Handshake,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "راهنمای معامله امن — املاک" },
      {
        name: "description",
        content:
          "مراحل معامله امن رهن و اجاره: احراز فایل و هویت، پرداخت دومرحله‌ای و قرارداد خودنویس.",
      },
    ],
  }),
  component: GuidePage,
});

const stages = [
  {
    icon: ShieldCheck,
    title: "احراز فایل",
    body: "پیش از انتشار، سند، مالکیت و مشخصات ملک بررسی می‌شود. تنها فایل‌های تأییدشده در جست‌وجو ظاهر می‌شوند.",
  },
  {
    icon: BadgeCheck,
    title: "احراز هویت طرفین",
    body: "هویت مالک و مستأجر با مدارک رسمی تأیید می‌شود تا طرفین با اطمینان کامل وارد مذاکره شوند.",
  },
  {
    icon: Handshake,
    title: "مذاکره ساختاریافته",
    body: "پیشنهاد، پیشنهاد متقابل و پذیرش در پلتفرم ثبت می‌شود؛ تاریخچه شفاف و قابل ممیزی است.",
  },
  {
    icon: Wallet,
    title: "پرداخت دومرحله‌ای امن",
    body: "وجه تضمین در آغاز و باقیمانده هنگام امضای قرارداد در سازوکار امن نگه داشته و آزاد می‌شود.",
  },
  {
    icon: FileCheck2,
    title: "قرارداد خودنویس و تسویه",
    body: "قرارداد در سامانه خودنویس آماده، امضا و پس از تسویه نهایی، فرآیند رسمی می‌شود.",
  },
];

function GuidePage() {
  return (
    <div className="app-container py-10 md:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          راهنمای معامله امن
        </div>
        <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
          پنج گام تا معامله‌ای بی‌دغدغه
        </h1>
        <p className="mt-3 text-sm leading-8 text-muted-foreground md:text-base">
          پلتفرم املاک تمام مسیر رهن و اجاره را از کشف فایل تا تسویه پوشش می‌دهد،
          تا مالک و مستأجر بدون واسطه اجباری، معامله‌ای شفاف و امن انجام دهند.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4">
        {stages.map((s, i) => (
          <Card key={s.title} className="border-border bg-surface">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <s.icon className="size-6" aria-hidden />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">
                  گام {["اول", "دوم", "سوم", "چهارم", "پنجم"][i]}
                </div>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link to="/search">شروع جست‌وجوی خانه</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/list-property">ثبت ملک</Link>
        </Button>
      </div>
    </div>
  );
}
