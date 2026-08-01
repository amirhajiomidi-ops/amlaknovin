import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  landlordContracts,
  landlordContractStatusLabels,
} from "@/data/landlord";
import { getProperty } from "@/data/properties";
import { formatJalali, formatTomans } from "@/lib/format";

export const Route = createFileRoute("/landlord/contracts")({
  component: LandlordContracts,
});

function LandlordContracts() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground">قراردادها</h2>
      {landlordContracts.map((c) => (
        <article
          key={c.id}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-foreground">
              {getProperty(c.propertyId)?.title}
            </div>
            <span className="rounded-lg bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              {landlordContractStatusLabels[c.status]}
            </span>
          </div>
          <div className="mt-3 grid gap-3 text-xs sm:grid-cols-4">
            <Field label="مستأجر" value={c.tenantName} />
            <Field label="ودیعه" value={formatTomans(c.deposit)} />
            <Field
              label="اجاره ماهانه"
              value={c.rent === 0 ? "—" : formatTomans(c.rent)}
            />
            <Field
              label="وجه در امانت"
              value={formatTomans(c.escrowAmount)}
            />
            <Field label="شروع" value={formatJalali(c.startDate)} />
            <Field label="پایان" value={formatJalali(c.endDate)} />
            <Field label="تسویه" value={c.settled ? "انجام‌شده" : "در انتظار"} />
          </div>
          {c.status === "awaiting-landlord" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm">امضای دیجیتال قرارداد</Button>
              <Button size="sm" variant="outline">
                مشاهده پیش‌نویس
              </Button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold text-foreground">{value}</div>
    </div>
  );
}
