import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarClock,
  Handshake,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCompactTomans, formatTomans, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سیستم طراحی — املاک" },
      {
        name: "description",
        content:
          "پیش‌نمایش Design System و Shell پلتفرم رهن و اجاره: رنگ‌ها، تایپوگرافی، دکمه‌ها، نشان‌ها و کارت‌های نمونه.",
      },
    ],
  }),
  component: DesignSystemPreview,
});

const paletteRows = [
  {
    group: "برند و اکشن‌ها",
    tokens: [
      { name: "primary", label: "آبی برند", swatch: "bg-primary" },
      { name: "primary-soft", label: "آبی نرم", swatch: "bg-primary-soft" },
      { name: "accent", label: "فیروزه‌ای مکمل", swatch: "bg-accent" },
      { name: "accent-soft", label: "فیروزه‌ای نرم", swatch: "bg-accent-soft" },
    ],
  },
  {
    group: "وضعیت‌ها",
    tokens: [
      { name: "success", label: "موفقیت", swatch: "bg-success" },
      { name: "warning", label: "هشدار", swatch: "bg-warning" },
      { name: "destructive", label: "خطا", swatch: "bg-destructive" },
      { name: "info", label: "اطلاع", swatch: "bg-info" },
    ],
  },
  {
    group: "سطوح و متن",
    tokens: [
      { name: "background", label: "پس‌زمینه", swatch: "bg-background border border-border" },
      { name: "surface", label: "سطح کارت", swatch: "bg-surface border border-border" },
      { name: "muted", label: "خنثی", swatch: "bg-muted" },
      { name: "border", label: "کادر", swatch: "bg-border" },
    ],
  },
] as const;

function DesignSystemPreview() {
  return (
    <div className="app-container space-y-14 py-10 md:py-14">
      {/* Hero */}
      <section className="fade-up overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-card md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-5">
            <Badge variant="secondary" className="rounded-full bg-primary-soft text-primary">
              <Sparkles className="ms-1 size-3.5" aria-hidden />
              پیش‌نمایش سیستم طراحی — فاز دوم
            </Badge>
            <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              از فایل معتبر تا قرارداد امن
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              شالوده بصری پلتفرم رهن و اجاره: توکن‌های رنگ، تایپوگرافی Vazirmatn،
              کامپوننت‌های پایه و اسکلت سراسری RTL. این صفحه فقط برای بازبینی
              سیستم طراحی است؛ صفحات محصول در گام‌های بعد ساخته می‌شوند.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg">جست‌وجوی خانه</Button>
              <Button size="lg" variant="outline">
                ثبت ملک
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="trust-badge border-success/30 bg-success-soft text-success">
                <ShieldCheck className="size-3.5" aria-hidden />
                فایل تأییدشده
              </span>
              <span className="trust-badge border-primary/30 bg-primary-soft text-primary">
                <BadgeCheck className="size-3.5" aria-hidden />
                مالک تأییدشده
              </span>
              <span className="trust-badge border-accent/30 bg-accent-soft text-accent">
                <Wallet className="size-3.5" aria-hidden />
                پرداخت امن
              </span>
            </div>
          </div>

          <Card className="border-border bg-background shadow-elevated">
            <CardHeader className="space-y-1">
              <CardDescription>ملک منتخب</CardDescription>
              <CardTitle className="text-lg leading-7">
                آپارتمان {toFaDigits(95)} متری دوخوابه در سعادت‌آباد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-muted p-3">
                  <div className="text-xs text-muted-foreground">ودیعه</div>
                  <div className="mt-1 font-semibold text-foreground">
                    {formatCompactTomans(1_500_000_000)}
                  </div>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <div className="text-xs text-muted-foreground">اجاره ماهانه</div>
                  <div className="mt-1 font-semibold text-foreground">
                    {formatCompactTomans(25_000_000)}
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">۲ خواب</Badge>
                <Badge variant="secondary">طبقه ۳</Badge>
                <Badge variant="secondary">آسانسور</Badge>
                <Badge variant="secondary">پارکینگ</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">تناسب مالی شما</span>
                <span className="font-medium text-success">متناسب با ملک</span>
              </div>
              <Button className="w-full">ثبت پیشنهاد</Button>
              <p className="text-center text-xs text-muted-foreground">
                برای ثبت پیشنهاد، بازدید الزامی نیست.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Palette */}
      <section className="space-y-5">
        <SectionTitle
          eyebrow="Design Tokens"
          title="پالت رنگ معنایی"
          description="همه رنگ‌ها از توکن‌های معنایی خوانده می‌شوند؛ در کامپوننت‌ها هیچ‌گاه رنگ خام ننویسید."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {paletteRows.map((row) => (
            <Card key={row.group}>
              <CardHeader>
                <CardTitle className="text-base">{row.group}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {row.tokens.map((t) => (
                  <div key={t.name} className="space-y-2">
                    <div
                      className={`h-14 w-full rounded-xl ${t.swatch}`}
                      aria-hidden
                    />
                    <div>
                      <div className="text-sm font-medium text-foreground">{t.label}</div>
                      <code className="text-xs text-muted-foreground">--{t.name}</code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Typography & numbers */}
      <section className="space-y-5">
        <SectionTitle
          eyebrow="Typography & Numerals"
          title="تایپوگرافی و اعداد فارسی"
          description="فونت Vazirmatn، اعداد فارسی در متن، مبالغ با جداکننده هزارگان و واحد «تومان»."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">سلسله‌مراتب متن</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h1>تیتر اصلی صفحه — H1</h1>
              <h2>تیتر بخش — H2</h2>
              <h3>تیتر فرعی — H3</h3>
              <p className="text-base leading-8 text-foreground">
                متن اصلی محتوا با فونت Vazirmatn و ارتفاع خط راحت برای خواندن
                پاراگراف‌های طولانی در فرم‌ها و راهنماها.
              </p>
              <p className="text-sm text-muted-foreground">
                متن فرعی و توضیحی برای Helper Textها و شرح‌های زیر فیلد.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">اعداد و مبالغ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="ودیعه (کامل)" value={formatTomans(1_500_000_000)} />
              <Row label="ودیعه (خلاصه)" value={formatCompactTomans(1_500_000_000)} />
              <Row label="اجاره ماهانه" value={formatTomans(25_000_000)} />
              <Row label="متراژ" value={`${toFaDigits(95)} متر`} />
              <Row label="کد پیگیری" value="TR-2026-000481" mono />
              <Row label="شماره موبایل" value="۰۹۱۲۳۴۵۶۷۸۹" mono />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Components */}
      <section className="space-y-5">
        <SectionTitle
          eyebrow="Components"
          title="کامپوننت‌های پایه"
          description="گونه‌های دکمه، نشان‌های اعتماد و وضعیت، فیلدهای فرم."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">دکمه‌ها و اکشن‌ها</CardTitle>
              <CardDescription>در هر صفحه فقط یک CTA اصلی داشته باشید.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button>پیشنهاد رزرو</Button>
                <Button variant="secondary">ذخیره فایل</Button>
                <Button variant="outline">مقایسه</Button>
                <Button variant="ghost">لغو</Button>
                <Button variant="destructive">حذف</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">کوچک</Button>
                <Button>پیش‌فرض</Button>
                <Button size="lg">بزرگ</Button>
                <Button disabled>غیرفعال</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">نشان‌ها و وضعیت‌ها</CardTitle>
              <CardDescription>
                رنگ به‌تنهایی برای انتقال وضعیت کافی نیست؛ همیشه آیکن و متن هم اضافه کنید.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <span className="trust-badge border-success/30 bg-success-soft text-success">
                <ShieldCheck className="size-3.5" aria-hidden /> فایل تأییدشده
              </span>
              <span className="trust-badge border-primary/30 bg-primary-soft text-primary">
                <BadgeCheck className="size-3.5" aria-hidden /> مالک تأییدشده
              </span>
              <span className="trust-badge border-warning/30 bg-warning-soft text-warning">
                <CalendarClock className="size-3.5" aria-hidden /> در انتظار بازدید
              </span>
              <span className="trust-badge border-accent/30 bg-accent-soft text-accent">
                <Handshake className="size-3.5" aria-hidden /> پیشنهاد فعال
              </span>
              <span className="trust-badge border-destructive/30 bg-destructive-soft text-destructive">
                خطای اعتبارسنجی مالی
              </span>
              <span className="trust-badge border-border bg-muted text-muted-foreground">
                هنوز ارزیابی نشده
              </span>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">فیلدهای فرم</CardTitle>
              <CardDescription>Touch target حداقل ۴۴ پیکسل و پیام‌های راهنمای شفاف.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ds-city">شهر</Label>
                <Input id="ds-city" placeholder="مثلاً تهران" />
                <p className="text-xs text-muted-foreground">تهران و کرج در فاز دوم پشتیبانی می‌شوند.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-budget">حداکثر ودیعه</Label>
                <Input id="ds-budget" placeholder={`مثلاً ${toFaDigits("1,500,000,000")}`} />
                <p className="text-xs text-muted-foreground">به تومان وارد کنید.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-phone">شماره موبایل</Label>
                <Input id="ds-phone" placeholder="۰۹۱۲…" inputMode="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ds-err">فیلد با خطا</Label>
                <Input
                  id="ds-err"
                  defaultValue="۰۹۱"
                  aria-invalid
                  className="border-destructive focus-visible:ring-destructive"
                />
                <p className="text-xs text-destructive">
                  شماره موبایل معتبر نیست؛ لطفاً ۱۱ رقم کامل وارد کنید.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Elevation */}
      <section className="space-y-5">
        <SectionTitle
          eyebrow="Elevation"
          title="سطوح و سایه‌ها"
          description="سایه‌ها ملایم و در سه سطح تعریف شده‌اند؛ برای Modal و Sticky Bar از سطح بالاتر استفاده کنید."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="text-sm font-semibold text-foreground">Flat</div>
            <p className="mt-1 text-xs text-muted-foreground">بدون سایه، فقط کادر.</p>
          </div>
          <div className="rounded-2xl bg-surface p-6 shadow-card">
            <div className="text-sm font-semibold text-foreground">Card</div>
            <p className="mt-1 text-xs text-muted-foreground">سایه پیش‌فرض کارت‌ها.</p>
          </div>
          <div className="rounded-2xl bg-surface p-6 shadow-elevated">
            <div className="text-sm font-semibold text-foreground">Elevated</div>
            <p className="mt-1 text-xs text-muted-foreground">برای Modal، Popover، Sticky Bar.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium text-foreground ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
