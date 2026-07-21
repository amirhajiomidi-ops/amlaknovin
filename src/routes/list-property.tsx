import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileText, Home, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/list-property")({
  head: () => ({
    meta: [
      { title: "ثبت ملک — املاک" },
      {
        name: "description",
        content:
          "ملک خود را با احراز مالک و فایل در پلتفرم املاک منتشر کنید و مستقیماً با مستأجران معتبر مذاکره کنید.",
      },
    ],
  }),
  component: ListPropertyPage,
});

const steps = [
  {
    icon: Home,
    title: "اطلاعات ملک",
    body: "آدرس تقریبی، متراژ، تعداد اتاق، امکانات و شرایط مالی را ثبت می‌کنید.",
  },
  {
    icon: ShieldCheck,
    title: "احراز مالکیت",
    body: "با ارسال سند و مدارک هویتی، مالکیت شما تأیید می‌شود.",
  },
  {
    icon: FileText,
    title: "بازبینی و انتشار",
    body: "تیم املاک فایل را بررسی کرده و در صورت تأیید منتشر می‌کند.",
  },
];

function ListPropertyPage() {
  return (
    <div className="app-container py-10 md:py-14">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            برای موجران
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            ملک خود را با اطمینان منتشر کنید
          </h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
            به‌جای انبوه تماس‌های نامرتبط، فقط با مستأجران احراز‌شده مذاکره کنید؛
            پیشنهادها را در پلتفرم دریافت و مسیر معامله را شفاف پیش ببرید.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg">شروع ثبت ملک</Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/guide">راهنمای معامله امن</Link>
            </Button>
          </div>

          <ul className="mt-8 space-y-3">
            {[
              "دسترسی فقط مستأجران تأییدشده",
              "پیشنهادهای ساختاریافته و قابل مقایسه",
              "پرداخت دومرحله‌ای امن با نگهداری وجه",
              "قرارداد خودنویس و تسویه یکپارچه",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="border-border bg-surface shadow-elevated">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              مراحل ثبت ملک
            </h2>
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <s.icon className="size-4" aria-hidden />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {i + 1}. {s.title}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-xl border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
              فرم کامل ثبت ملک در گام بعدی این پروتوتایپ ساخته می‌شود.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
