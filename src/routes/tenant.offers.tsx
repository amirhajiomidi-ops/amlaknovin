import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getProperty } from "@/data/properties";
import {
  offerStatusLabels,
  offers,
  type Offer,
  type OfferStatus,
} from "@/data/tenant";
import {
  formatCompactTomans,
  formatJalali,
  formatJalaliTime,
  toFaDigits,
} from "@/lib/format";

export const Route = createFileRoute("/tenant/offers")({
  head: () => ({
    meta: [
      { title: "پیشنهادها و مذاکره — پنل مستأجر" },
      {
        name: "description",
        content: "پیگیری پیشنهاد قیمت، پاسخ مالک و پذیرش نهایی رهن و اجاره.",
      },
      { property: "og:title", content: "پیشنهادها و مذاکره — پنل مستأجر" },
      {
        property: "og:description",
        content: "همه پیشنهادها و پیام‌های مالک در یک نخ گفت‌وگو.",
      },
    ],
  }),
  component: OffersPage,
});

const statusTone: Record<OfferStatus, string> = {
  draft: "border-border bg-muted text-muted-foreground",
  sent: "border-primary/30 bg-primary/10 text-primary",
  counter: "border-warning/30 bg-warning-soft text-warning",
  accepted: "border-success/30 bg-success-soft text-success",
  rejected: "border-destructive/30 bg-destructive-soft text-destructive",
};

function OffersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">پیشنهادها</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          مذاکره ودیعه و اجاره را در بستر امن انجام دهید. سابقه گفت‌وگو ثبت می‌شود.
        </p>
      </div>

      {offers.length === 0 ? (
        <EmptyOffers />
      ) : (
        <div className="space-y-4">
          {offers.map((o) => (
            <OfferThread key={o.id} offer={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferThread({ offer }: { offer: Offer }) {
  const p = getProperty(offer.propertyId);
  if (!p) return null;
  const closed = offer.status === "accepted" || offer.status === "rejected";

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
          <div className="flex items-start gap-3">
            <img
              src={p.images[0]}
              alt=""
              className="size-16 rounded-xl object-cover"
            />
            <div>
              <Link
                to="/property/$id"
                params={{ id: p.id }}
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                {p.title}
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                آخرین بروزرسانی: {formatJalali(offer.updatedAt)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">
                  ودیعه: {formatCompactTomans(offer.currentDeposit)}
                </span>
                <span className="rounded-lg bg-background px-2 py-1 text-foreground">
                  اجاره: {formatCompactTomans(offer.currentRent)}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={statusTone[offer.status]}>
            {offerStatusLabels[offer.status]}
          </Badge>
        </div>

        <ul className="space-y-3 p-4">
          {offer.messages.map((m, i) => {
            const mine = m.from === "tenant";
            return (
              <li
                key={i}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground border border-border"
                  }`}
                >
                  <div className={`mb-1 text-[11px] ${mine ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {mine ? "شما" : "مالک"} • {formatJalaliTime(m.at)} — {formatJalali(m.at)}
                  </div>
                  <p>{m.text}</p>
                  {(m.deposit !== undefined || m.rent !== undefined) && (
                    <div className={`mt-2 flex flex-wrap gap-2 text-xs ${mine ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {m.deposit !== undefined && (
                        <span>ودیعه: {formatCompactTomans(m.deposit)}</span>
                      )}
                      {m.rent !== undefined && (
                        <span>اجاره: {formatCompactTomans(m.rent)}</span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {closed ? (
          <div className="border-t border-border bg-background p-4 text-center">
            {offer.status === "accepted" ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-success">
                  پیشنهاد شما پذیرفته شد. زمان رزرو با پرداخت امن است.
                </p>
                <Button asChild size="sm">
                  <Link to="/tenant/contracts">
                    ادامه به رزرو و قرارداد <ArrowLeft className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-destructive">
                این پیشنهاد بسته شده است. می‌توانید فایل مشابه پیدا کنید.
              </p>
            )}
          </div>
        ) : (
          <div className="border-t border-border bg-background p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              ارسال پیشنهاد جدید
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">ودیعه پیشنهادی (تومان)</Label>
                <Input defaultValue={toFaDigits(offer.currentDeposit)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">اجاره پیشنهادی (تومان)</Label>
                <Input defaultValue={toFaDigits(offer.currentRent)} />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <Label className="text-xs">توضیح</Label>
              <Textarea placeholder="مثلا: امکان امضای زودتر قرارداد را دارم." />
            </div>
            <div className="mt-3 flex justify-end">
              <Button>
                <Send className="size-4" aria-hidden />
                ارسال پیشنهاد
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyOffers() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center">
      <Handshake className="mx-auto size-8 text-muted-foreground" aria-hidden />
      <p className="mt-2 text-sm text-muted-foreground">
        هنوز پیشنهادی ثبت نکرده‌اید.
      </p>
      <Button asChild className="mt-4">
        <Link to="/search">جست‌وجوی ملک</Link>
      </Button>
    </div>
  );
}
