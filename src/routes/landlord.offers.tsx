import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { landlordOffers, landlordOfferStatusLabels } from "@/data/landlord";
import { getProperty } from "@/data/properties";
import { formatJalali, formatTomans, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/landlord/offers")({
  component: LandlordOffers,
});

function LandlordOffers() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground">پیشنهادهای دریافتی</h2>
      {landlordOffers.map((o) => (
        <article
          key={o.id}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">
                {o.tenantName} · امتیاز {toFaDigits(o.creditScore)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {getProperty(o.propertyId)?.title}
              </div>
            </div>
            <span className="rounded-lg bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              {landlordOfferStatusLabels[o.status]}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-border bg-background p-3 text-xs">
            <div>
              <div className="text-muted-foreground">ودیعه پیشنهادی</div>
              <div className="mt-1 font-semibold text-foreground">
                {formatTomans(o.deposit)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">اجاره ماهانه</div>
              <div className="mt-1 font-semibold text-foreground">
                {o.rent === 0 ? "—" : formatTomans(o.rent)}
              </div>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {o.messages.map((m, i) => (
              <li
                key={i}
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-6 ${
                  m.from === "landlord"
                    ? "ms-auto bg-primary-soft text-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="mb-1 text-[11px] text-muted-foreground">
                  {m.from === "landlord" ? "شما" : o.tenantName} ·{" "}
                  {formatJalali(m.at)}
                </div>
                {m.text}
              </li>
            ))}
          </ul>

          {o.status === "open" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm">پذیرش پیشنهاد</Button>
              <Button size="sm" variant="outline">
                پیشنهاد متقابل
              </Button>
              <Button size="sm" variant="ghost">
                رد
              </Button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
