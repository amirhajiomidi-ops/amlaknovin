import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  Building2,
  Calendar,
  CalendarClock,
  Car,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Layers,
  MapPin,
  Package,
  Ruler,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  currentTenantFit,
  fitLabels,
  getProperty,
  properties,
  statusLabels,
  type FinancialFit,
  type Property,
} from "@/data/properties";
import { formatCompactTomans, formatTomans, toFaDigits } from "@/lib/format";
import { PropertyCard } from "@/components/property/property-card";

export const Route = createFileRoute("/property/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "ملک پیدا نشد — املاک" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.property;
    return {
      meta: [
        { title: `${p.title} — املاک` },
        {
          name: "description",
          content: `${p.title} در ${p.city}، ${p.neighborhood}. ودیعه ${formatCompactTomans(p.deposit)}${p.dealType === "rent" ? ` و اجاره ${formatCompactTomans(p.rent)}` : ""}.`,
        },
        { property: "og:title", content: `${p.title} — املاک` },
        {
          property: "og:description",
          content: `${p.city}، ${p.neighborhood} — ${toFaDigits(p.area)} متر، ${toFaDigits(p.rooms)} خواب.`,
        },
        { property: "og:image", content: p.images[0] },
        { name: "twitter:image", content: p.images[0] },
      ],
    };
  },
  notFoundComponent: PropertyNotFound,
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData() as { property: Property };
  const fit = currentTenantFit[property.id];

  const similar = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.city === property.city &&
        p.status === "published",
    )
    .slice(0, 3);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="app-container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="mb-4 flex items-center gap-1 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-foreground">خانه</Link>
          <ChevronLeft className="size-3" aria-hidden />
          <Link to="/search" className="hover:text-foreground">جست‌وجو</Link>
          <ChevronLeft className="size-3" aria-hidden />
          <span className="text-foreground">{property.city}</span>
          <ChevronLeft className="size-3" aria-hidden />
          <span className="text-foreground">{property.neighborhood}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <Gallery property={property} />

            {/* Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {property.dealType === "mortgage" ? "رهن کامل" : "رهن و اجاره"}
                </Badge>
                {property.status !== "published" ? (
                  <Badge
                    variant="outline"
                    className="border-warning/40 bg-warning-soft text-warning"
                  >
                    {statusLabels[property.status]}
                  </Badge>
                ) : null}
                {property.fileVerified ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="trust-badge border-success/30 bg-success-soft text-success">
                        <ShieldCheck className="size-3.5" aria-hidden />
                        فایل تأییدشده
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      سند و مشخصات این فایل توسط تیم املاک بررسی و تأیید شده است.
                    </TooltipContent>
                  </Tooltip>
                ) : null}
                {property.ownerVerified ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="trust-badge border-primary/30 bg-primary-soft text-primary">
                        <BadgeCheck className="size-3.5" aria-hidden />
                        مالک تأییدشده
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      هویت مالک با مدارک رسمی احراز شده است.
                    </TooltipContent>
                  </Tooltip>
                ) : null}
                {property.onlineTour ? (
                  <span className="trust-badge border-accent/30 bg-accent-soft text-accent">
                    <Video className="size-3.5" aria-hidden />
                    بازدید آنلاین
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl font-bold leading-9 text-foreground md:text-3xl">
                {property.title}
              </h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden />
                {property.city}، {property.neighborhood} — {property.approxLocation}
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SpecCard icon={Ruler} label="متراژ" value={`${toFaDigits(property.area)} متر`} />
              <SpecCard icon={Building2} label="خواب" value={`${toFaDigits(property.rooms)}`} />
              <SpecCard
                icon={Layers}
                label="طبقه"
                value={`${toFaDigits(property.floor)} از ${toFaDigits(property.totalFloors)}`}
              />
              <SpecCard
                icon={Calendar}
                label="سال ساخت"
                value={toFaDigits(property.yearBuilt)}
              />
            </div>

            {/* Amenities & description */}
            <Card>
              <CardContent className="space-y-5 p-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">امکانات</h2>
                  <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                    <AmenityRow ok={property.elevator} icon={Layers} label="آسانسور" />
                    <AmenityRow ok={property.parking} icon={Car} label="پارکینگ" />
                    <AmenityRow ok={property.storage} icon={Package} label="انباری" />
                    {property.amenities.map((a) => (
                      <AmenityRow key={a} ok icon={BadgeCheck} label={a} />
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">توضیحات</h2>
                  <p className="mt-3 text-sm leading-8 text-muted-foreground">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Approx location note */}
            <Card className="bg-primary-soft/60 border-primary/20">
              <CardContent className="flex items-start gap-3 p-5 text-sm text-foreground">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <div className="font-semibold">موقعیت تقریبی</div>
                  <p className="mt-1 leading-7 text-muted-foreground">
                    برای حفظ حریم خصوصی مالک، آدرس دقیق تنها پس از قطعی‌شدن نوبت
                    بازدید یا پذیرش پیشنهاد نمایش داده می‌شود.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline for user */}
            <UserTimeline fit={fit} property={property} />
          </div>

          {/* Sticky action card (desktop) */}
          <aside className="lg:sticky lg:top-20 lg:h-fit space-y-4">
            <ActionPanel property={property} fit={fit} />
            <AdSlot placement="property-detail" size="sidebar" />
          </aside>

        </div>

        {/* Similar */}
        {similar.length > 0 ? (
          <section className="mt-16 space-y-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                فایل‌های مشابه
              </div>
              <h2 className="mt-1 text-2xl font-bold text-foreground">
                گزینه‌های نزدیک در {property.city}
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} fit={currentTenantFit[p.id]} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* Sticky bottom action bar (mobile) */}
      <div className="sticky-action-bar lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">ودیعه</div>
            <div className="text-sm font-semibold text-foreground">
              {formatCompactTomans(property.deposit)}
            </div>
          </div>
          <Button className="flex-1" size="lg">
            <Handshake className="size-4" aria-hidden />
            ثبت پیشنهاد
          </Button>
          {property.bookingEnabled ? (
            <Button variant="outline" size="lg" className="flex-1">
              <CalendarClock className="size-4" aria-hidden />
              رزرو
            </Button>
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  );
}

function ActionPanel({
  property,
  fit,
}: {
  property: Property;
  fit?: FinancialFit;
}) {
  const isMortgage = property.dealType === "mortgage";
  const fitTone: Record<FinancialFit, string> = {
    match: "bg-success-soft text-success border-success/30",
    review: "bg-warning-soft text-warning border-warning/30",
    mismatch: "bg-destructive-soft text-destructive border-destructive/30",
    unknown: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="border-border bg-surface shadow-elevated">
      <CardContent className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-3">
            <div className="text-xs text-muted-foreground">ودیعه</div>
            <div className="mt-1 text-base font-bold text-foreground">
              {formatCompactTomans(property.deposit)}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {toFaDigits(new Intl.NumberFormat("en-US").format(property.deposit))} تومان
            </div>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <div className="text-xs text-muted-foreground">اجاره ماهانه</div>
            <div className="mt-1 text-base font-bold text-foreground">
              {isMortgage ? "—" : formatCompactTomans(property.rent)}
            </div>
            {!isMortgage ? (
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {toFaDigits(new Intl.NumberFormat("en-US").format(property.rent))} تومان
              </div>
            ) : null}
          </div>
        </div>

        {fit ? (
          <div
            className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${fitTone[fit]}`}
          >
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <div className="font-semibold">تناسب مالی شما: {fitLabels[fit]}</div>
              <p className="mt-0.5 leading-6 opacity-80">
                {fit === "match"
                  ? "براساس ارزیابی محرمانه، این ملک با توان مالی شما هم‌خوانی دارد."
                  : fit === "review"
                    ? "برای تصمیم دقیق‌تر، اطلاعات مالی خود را تکمیل کنید."
                    : fit === "mismatch"
                      ? "این ملک با ارزیابی فعلی شما هم‌خوانی ندارد."
                      : "هنوز ارزیابی مالی انجام نشده است."}
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Button size="lg" className="w-full">
            <Handshake className="size-4" aria-hidden />
            ثبت پیشنهاد
          </Button>
          {property.bookingEnabled ? (
            <Button size="lg" variant="outline" className="w-full">
              <CalendarClock className="size-4" aria-hidden />
              رزرو بازدید
            </Button>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-background p-3 text-center text-xs text-muted-foreground">
              نوبت‌دهی برای این فایل فعلاً غیرفعال است.
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground">
            برای ثبت پیشنهاد، بازدید الزامی نیست.
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-muted"
          >
            <Bookmark className="size-4" aria-hidden />
            ذخیره
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-muted"
          >
            <Share2 className="size-4" aria-hidden />
            اشتراک‌گذاری
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-muted"
          >
            <ShieldAlert className="size-4" aria-hidden />
            گزارش
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function Gallery({ property }: { property: Property }) {
  const [index, setIndex] = useState(0);
  const total = property.images.length;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
        <img
          src={property.images[index]}
          alt={`${property.title} — تصویر ${toFaDigits(index + 1)}`}
          className="h-full w-full object-cover"
        />
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="تصویر قبلی"
              className="absolute end-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-foreground/60 text-primary-foreground backdrop-blur transition hover:bg-foreground/80"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="تصویر بعدی"
              className="absolute start-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-foreground/60 text-primary-foreground backdrop-blur transition hover:bg-foreground/80"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <div className="absolute bottom-3 start-1/2 -translate-x-1/2 rounded-full bg-foreground/60 px-3 py-1 text-xs text-primary-foreground backdrop-blur">
              {toFaDigits(index + 1)} / {toFaDigits(total)}
            </div>
          </>
        ) : null}
      </div>
      {total > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {property.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-primary"
                  : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <Icon className="size-5 text-primary" aria-hidden />
      <div className="mt-2 text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}

function AmenityRow({
  ok,
  icon: Icon,
  label,
}: {
  ok: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li
      className={`flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 ${
        ok ? "text-foreground" : "text-muted-foreground line-through"
      }`}
    >
      <Icon className={`size-4 ${ok ? "text-success" : "text-muted-foreground"}`} aria-hidden />
      {label}
    </li>
  );
}

function UserTimeline({ property, fit }: { property: Property; fit?: FinancialFit }) {
  const steps = [
    {
      key: "browse",
      title: "مشاهده فایل",
      body: "این فایل را باز کردید.",
      done: true,
    },
    {
      key: "booking",
      title: property.bookingEnabled ? "رزرو بازدید (اختیاری)" : "بدون نوبت‌دهی",
      body: property.bookingEnabled
        ? "می‌توانید یکی از نوبت‌های آزاد را رزرو کنید."
        : "این فایل بدون نوبت‌دهی است؛ مستقیم پیشنهاد ثبت کنید.",
      done: false,
    },
    {
      key: "offer",
      title: "ثبت پیشنهاد",
      body: fit === "mismatch"
        ? "با ارزیابی فعلی، ثبت پیشنهاد توصیه نمی‌شود."
        : "شرایط مالی خود را مستقیم به مالک ارسال کنید.",
      done: false,
    },
    {
      key: "contract",
      title: "قرارداد و تسویه",
      body: "پس از توافق، قرارداد در خودنویس و تسویه امن انجام می‌شود.",
      done: false,
    },
  ];

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">مسیر شما در این فایل</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            وضعیت اقدامات شما به‌صورت شخصی نمایش داده می‌شود.
          </p>
        </div>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s.key} className="flex items-start gap-3">
              <div
                className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                  s.done
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {toFaDigits(i + 1)}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{s.title}</div>
                <div className="text-xs leading-6 text-muted-foreground">{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}


function PropertyNotFound() {
  return (
    <div className="app-container py-20 text-center">
      <h1 className="text-3xl font-bold text-foreground">این فایل در دسترس نیست</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        ممکن است این ملک غیرفعال یا حذف شده باشد.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/search">بازگشت به جست‌وجو</Link>
        </Button>
      </div>
    </div>
  );
}
