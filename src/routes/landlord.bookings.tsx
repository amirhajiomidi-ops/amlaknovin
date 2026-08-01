import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  landlordVisitRequests,
  visitRequestStatusLabels,
} from "@/data/landlord";
import { getProperty } from "@/data/properties";
import { formatJalali, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/landlord/bookings")({
  component: LandlordBookings,
});

function LandlordBookings() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground">درخواست بازدید</h2>
      {landlordVisitRequests.map((v) => (
        <article
          key={v.id}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">
                {v.tenantName}
                {v.tenantVerified ? (
                  <span className="ms-2 rounded-md bg-success-soft px-2 py-0.5 text-[11px] text-success">
                    احرازشده
                  </span>
                ) : (
                  <span className="ms-2 rounded-md bg-warning-soft px-2 py-0.5 text-[11px] text-warning">
                    احراز ناقص
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {getProperty(v.propertyId)?.title}
              </div>
            </div>
            <span className="rounded-lg bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              {visitRequestStatusLabels[v.status]}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>{formatJalali(v.date)}</span>
            <span>{v.slot}</span>
            <span>{v.channel}</span>
            <span>امتیاز اعتباری: {toFaDigits(v.creditScore)}</span>
          </div>
          {v.status === "pending" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm">تأیید بازدید</Button>
              <Button size="sm" variant="outline">
                پیشنهاد زمان دیگر
              </Button>
              <Button size="sm" variant="ghost">
                رد درخواست
              </Button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
