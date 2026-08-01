import { createFileRoute } from "@tanstack/react-router";
import { Eye, Heart, CalendarClock } from "lucide-react";

import { PromoteDialog } from "@/components/landlord/promote-dialog";
import { useAppState } from "@/context/app-state";
import { landlordPropertyIds, listingStats } from "@/data/landlord";
import { getProperty, statusLabels } from "@/data/properties";
import { getPlan } from "@/data/promotions";
import { activePromo, daysLeft } from "@/lib/ranking";
import { formatCompactTomans, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/landlord/properties")({
  component: LandlordProperties,
});

function LandlordProperties() {
  const { promotions } = useAppState();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground">ملک‌های من</h2>
      {landlordPropertyIds.map((id) => {
        const p = getProperty(id);
        if (!p) return null;
        const stats = listingStats[id];
        const promo = activePromo(promotions, id);
        const plan = promo ? getPlan(promo.planId) : null;
        return (
          <article
            key={id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row"
          >
            <img
              src={p.images[0]}
              alt={p.title}
              loading="lazy"
              className="h-32 w-full shrink-0 rounded-xl object-cover sm:w-44"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {p.title}
                </h3>
                {plan ? (
                  <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {plan.badgeLabel} · {toFaDigits(daysLeft(promo!.expiresAt))} روز
                  </span>
                ) : null}
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                  {statusLabels[p.status]}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3.5" aria-hidden />
                  {toFaDigits(stats?.views ?? 0)} بازدید
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="size-3.5" aria-hidden />
                  {toFaDigits(stats?.saves ?? 0)} ذخیره
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="size-3.5" aria-hidden />
                  {toFaDigits(stats?.visitRequests ?? 0)} درخواست بازدید
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                ودیعه {formatCompactTomans(p.deposit)}
                {p.dealType === "rent"
                  ? ` · اجاره ${formatCompactTomans(p.rent)}`
                  : ""}
              </div>
              <div className="mt-3">
                <PromoteDialog
                  propertyId={id}
                  propertyTitle={p.title}
                  label={plan ? "تمدید یا تغییر طرح" : "ارتقای آگهی"}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
