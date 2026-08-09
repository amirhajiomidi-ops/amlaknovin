import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Camera,
  Crown,
  MapPin,
  Rocket,
  ShieldCheck,
  Video,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/context/app-state";
import type { Property } from "@/data/properties";
import { fitLabels, statusLabels, type FinancialFit } from "@/data/properties";
import { formatCompactTomans, toFaDigits } from "@/lib/format";
import { activePromo } from "@/lib/ranking";

interface Props {
  property: Property;
  fit?: FinancialFit;
}

export function PropertyCard({ property, fit }: Props) {
  const { promotions } = useAppState();
  // طرح‌های ارتقا وابسته به زمان هستند؛ برای جلوگیری از اختلاف SSR/CSR فقط پس از mount نمایش می‌دهیم.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const promo = mounted ? activePromo(promotions, property.id) : undefined;

  const isMortgage = property.dealType === "mortgage";
  const statusTone: Record<Property["status"], string> = {
    published: "bg-success-soft text-success border-success/30",
    reserved: "bg-warning-soft text-warning border-warning/30",
    locked: "bg-muted text-muted-foreground border-border",
    inactive: "bg-muted text-muted-foreground border-border",
    "needs-fix": "bg-destructive-soft text-destructive border-destructive/30",
  };

  const fitTone: Record<FinancialFit, string> = {
    match: "text-success",
    review: "text-warning",
    mismatch: "text-destructive",
    unknown: "text-muted-foreground",
  };

  const promoFrame =
    promo?.planId === "featured"
      ? "border-primary/50 ring-1 ring-primary/25"
      : promo?.planId === "urgent"
        ? "border-warning/50 ring-1 ring-warning/25"
        : "border-border";

  return (
    <Link
      to="/property/$id"
      params={{ id: property.id }}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated ${promoFrame}`}
    >

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1">
            {promo?.planId === "featured" ? (
              <span className="trust-badge border-primary/40 bg-primary text-primary-foreground">
                <Crown className="size-3" aria-hidden />
                ویژه
              </span>
            ) : null}
            {promo?.planId === "urgent" ? (
              <span className="trust-badge border-warning/40 bg-warning-soft text-warning">
                <Zap className="size-3" aria-hidden />
                فوری
              </span>
            ) : null}
            {promo?.planId === "bump-once" || promo?.planId === "bump-auto-7" ? (
              <span className="trust-badge border-accent/30 bg-accent-soft text-accent">
                <Rocket className="size-3" aria-hidden />
                نردبان
              </span>
            ) : null}

            {property.fileVerified ? (
              <span className="trust-badge border-success/30 bg-success-soft text-success">
                <ShieldCheck className="size-3" aria-hidden />
                فایل تأییدشده
              </span>
            ) : null}
            {property.ownerVerified ? (
              <span className="trust-badge border-primary/30 bg-primary-soft text-primary">
                <BadgeCheck className="size-3" aria-hidden />
                مالک تأییدشده
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-foreground/70 px-2 py-1 text-[10px] font-medium text-primary-foreground backdrop-blur">
            <Camera className="size-3" aria-hidden />
            {toFaDigits(property.images.length)}
            {property.onlineTour ? (
              <>
                <span className="mx-1 h-2 w-px bg-primary-foreground/40" />
                <Video className="size-3" aria-hidden />
              </>
            ) : null}
          </div>
        </div>
        {property.status !== "published" ? (
          <div className="absolute inset-x-0 bottom-0 bg-foreground/70 px-3 py-1.5 text-center text-xs font-medium text-primary-foreground backdrop-blur">
            {statusLabels[property.status]}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground">
            {property.title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {isMortgage ? "رهن کامل" : "رهن و اجاره"}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" aria-hidden />
          <span>
            {property.city} — {property.neighborhood}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-0.5">
            {toFaDigits(property.area)} متر
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5">
            {toFaDigits(property.rooms)} خواب
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5">
            طبقه {toFaDigits(property.floor)}
          </span>
          {property.parking ? (
            <span className="rounded-md bg-muted px-2 py-0.5">پارکینگ</span>
          ) : null}
          {property.elevator ? (
            <span className="rounded-md bg-muted px-2 py-0.5">آسانسور</span>
          ) : null}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-3">
          <div>
            <div className="text-[11px] text-muted-foreground">ودیعه</div>
            <div className="text-sm font-semibold text-foreground">
              {formatCompactTomans(property.deposit)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">اجاره ماهانه</div>
            <div className="text-sm font-semibold text-foreground">
              {isMortgage ? "—" : formatCompactTomans(property.rent)}
            </div>
          </div>
        </div>

        {fit ? (
          <div className={`text-xs font-medium ${fitTone[fit]}`}>
            تناسب مالی شما: {fitLabels[fit]}
          </div>
        ) : null}
      </div>

      <div
        className={`flex items-center justify-between border-t border-border px-4 py-2 text-xs ${
          statusTone[property.status]
        }`}
      >
        <span>{statusLabels[property.status]}</span>
        <span className="text-muted-foreground">
          {property.bookingEnabled ? "نوبت‌دهی فعال" : "بدون نوبت‌دهی"}
        </span>
      </div>
    </Link>
  );
}
