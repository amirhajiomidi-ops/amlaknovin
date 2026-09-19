import { AdSlot } from "@/components/ads/ad-slot";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  FileCheck2,
  Handshake,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PropertyCard } from "@/components/property/property-card";
import { properties, currentTenantFit } from "@/data/properties";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "هوم نوین — از فایل معتبر تا قرارداد امن" },
      {
        name: "description",
        content:
          "پلتفرم امن رهن و اجاره هوم نوین؛ فایل تأییدشده، پرداخت امن و قرارداد یکپارچه.",
      },
      {
        property: "og:title",
        content: "هوم نوین — از فایل معتبر تا قرارداد امن",
      },
      {
        property: "og:description",
        content:
          "پلتفرم امن رهن و اجاره هوم نوین؛ فایل تأییدشده، پرداخت امن و قرارداد یکپارچه.",
      },
    ],
  }),
  component: HomePage,
});

const benefits = [
  {
    icon: ShieldCheck,
    title: "فایل تأییدشده",
    body: "قبل از انتشار، سند و هویت مالک بررسی می‌شود تا با فایل واقعی و معتبر روبه‌رو باشید.",
  },
  {
    icon: Handshake,
    title: "مذاکره شفاف",
    body: "پیشنهاد و پیشنهاد متقابل به‌صورت ساختاریافته ثبت می‌شود؛ تاریخچه کامل قابل ممیزی است.",
  },
  {
    icon: Wallet,
    title: "پرداخت امن",
    body: "وجه تضمین و باقیمانده در دو مرحله و در سازوکار امن نگهداری و آزاد می‌شود.",
  },
];

const dealSteps = [
  {
    step: "۱",
    title: "کشف و بازدید",
    body: "میان فایل‌های تأییدشده جست‌وجو کنید و در صورت تمایل، نوبت بازدید رزرو کنید.",
  },
  {
    step: "۲",
    title: "پیشنهاد و توافق",
    body: "شرایط مالی را مستقیم با مالک مذاکره و پیشنهاد نهایی را ثبت کنید.",
  },
  {
    step: "۳",
    title: "قرارداد و تسویه",
    body: "قرارداد در خودنویس آماده، امضا و وجه در سازوکار امن تسویه می‌شود.",
  },
];

const faqs = [
  {
    q: "برای ثبت پیشنهاد، بازدید الزامی است؟",
    a: "خیر. رزرو بازدید کاملاً اختیاری است و می‌توانید مستقیماً پیشنهاد خود را ثبت کنید.",
  },
  {
    q: "چه شهرهایی در فاز دوم پشتیبانی می‌شوند؟",
    a: "تهران و کرج. توسعه به سایر کلان‌شهرها در نقشه‌راه محصول قرار دارد.",
  },
  {
    q: "پرداخت چگونه امن نگه داشته می‌شود؟",
    a: "وجه تضمین در آغاز و باقیمانده در زمان امضای قرارداد در سازوکار امن نگهداری و آزاد می‌شود.",
  },
  {
    q: "استفاده از مشاور اجباری است؟",
    a: "خیر. مالک و مستأجر می‌توانند بدون واسطه مسیر معامله را کامل کنند.",
  },
];

function HomePage() {
  const featured = properties.filter((p) => p.status === "published").slice(0, 6);

  return (
    <div className="space-y-16 py-8 md:space-y-24 md:py-12">
      {/* Hero */}
      <section className="app-container">
        <div className="fade-up relative overflow-hidden rounded-3xl border border-border bg-gradient-to-bl from-primary-soft via-surface to-accent-soft p-8 md:p-14">
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-foreground md:text-5xl md:leading-[1.15]">
            از فایل معتبر تا قرارداد امن
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
            مسیر امن رهن و اجاره مسکونی؛ فایل تأییدشده، هویت طرفین، پرداخت
            دومرحله‌ای و قرارداد یکپارچه — همه در یک پلتفرم.
          </p>

          <SearchBox />

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="trust-badge border-success/30 bg-success-soft text-success">
              <ShieldCheck className="size-3.5" aria-hidden /> فایل تأییدشده
            </span>
            <span className="trust-badge border-primary/30 bg-primary-soft text-primary">
              <BadgeCheck className="size-3.5" aria-hidden /> مالک تأییدشده
            </span>
            <span className="trust-badge border-accent/30 bg-accent-soft text-accent">
              <Wallet className="size-3.5" aria-hidden /> پرداخت امن
            </span>
            <span className="trust-badge border-border bg-surface text-muted-foreground">
              <FileCheck2 className="size-3.5" aria-hidden /> قرارداد خودنویس
            </span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="app-container">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title} className="border-border bg-surface">
              <CardContent className="space-y-3 p-6">
                <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <b.icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  {b.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="app-container space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              فایل‌های منتخب
            </div>
            <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
              انتخاب‌های تأییدشده هفته
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/search">
              مشاهده همه
              <ArrowLeft className="ms-1 size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              fit={currentTenantFit[p.id]}
            />
          ))}
        </div>
        <div className="text-center md:hidden">
          <Button asChild variant="outline">
            <Link to="/search">مشاهده همه فایل‌ها</Link>
          </Button>
        </div>
      </section>

      {/* بنر تبلیغاتی */}
      <section className="app-container">
        <AdSlot placement="home-leaderboard" size="leaderboard" />
      </section>

      {/* Deal steps */}

      <section className="app-container">
        <div className="rounded-3xl border border-border bg-surface p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              مسیر معامله امن
            </div>
            <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
              سه گام تا کلید خانه
            </h2>
          </div>
          <div className="relative grid gap-6 md:grid-cols-3">
            {dealSteps.map((s, i) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-border bg-background p-6"
              >
                <div className="mb-3 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {s.body}
                </p>
                {i < dealSteps.length - 1 ? (
                  <div
                    className="absolute -start-3 top-1/2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-primary md:flex"
                    aria-hidden
                  >
                    ←
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/guide">راهنمای کامل معامله امن</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="app-container">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              پرسش‌های پرتکرار
            </div>
            <h2 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
              پیش از شروع، این‌ها را بدانید
            </h2>
          </div>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-surface px-4">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-right text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

function SearchBox() {
  return (
    <form
      action="/search"
      method="get"
      className="mt-8 grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-elevated md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end md:gap-2 md:p-3"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          شهر و محله
        </span>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            name="q"
            type="search"
            placeholder="مثلاً سعادت‌آباد یا گوهردشت"
            className="h-11 w-full rounded-xl border border-border bg-background pe-9 ps-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          نوع معامله
        </span>
        <select
          name="deal"
          defaultValue=""
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary"
        >
          <option value="">همه</option>
          <option value="rent">رهن و اجاره</option>
          <option value="mortgage">رهن کامل</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          حداکثر ودیعه
        </span>
        <select
          name="deposit"
          defaultValue=""
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:border-primary"
        >
          <option value="">بدون محدودیت</option>
          <option value="500">تا ۵۰۰ میلیون</option>
          <option value="1000">تا ۱ میلیارد</option>
          <option value="2000">تا ۲ میلیارد</option>
          <option value="5000">تا ۵ میلیارد</option>
        </select>
      </label>
      <Button asChild size="lg" className="h-11">
        <Link to="/search">جست‌وجوی خانه</Link>
      </Button>
    </form>
  );
}
