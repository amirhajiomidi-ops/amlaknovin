import { useState } from "react";
import { Rocket, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TopUpDialog } from "@/components/wallet/wallet-panel";
import { useAppState } from "@/context/app-state";
import { promotionPlans, type PromotionPlanId } from "@/data/promotions";
import { formatTomans, toFaDigits } from "@/lib/format";

interface Props {
  propertyId: string;
  propertyTitle: string;
  label?: string;
}

export function PromoteDialog({ propertyId, propertyTitle, label }: Props) {
  const { balance, purchasePromotion } = useAppState();
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useState<PromotionPlanId>("featured");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const plan = promotionPlans.find((p) => p.id === planId)!;
  const insufficient = balance < plan.price;

  const confirm = () => {
    const res = purchasePromotion(propertyId, planId, propertyTitle);
    if (!res.ok) {
      setError("موجودی کیف پول کافی نیست. ابتدا کیف پول را شارژ کنید.");
      return;
    }
    setError(null);
    setDone(true);
    window.setTimeout(() => {
      setDone(false);
      setOpen(false);
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setError(null);
        setDone(false);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Rocket className="size-4" aria-hidden />
          {label ?? "ارتقای آگهی"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>ارتقای آگهی</DialogTitle>
          <DialogDescription>{propertyTitle}</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
            طرح «{plan.title}» فعال شد و مبلغ از کیف پول کسر گردید.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {promotionPlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPlanId(p.id);
                    setError(null);
                  }}
                  className={`w-full rounded-xl border p-3 text-start transition-colors ${
                    planId === p.id
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {p.title}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {formatTomans(p.price)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    {p.description} · مدت: {toFaDigits(p.durationDays)} روز
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-3 text-xs">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="size-4" aria-hidden />
                موجودی کیف پول
              </span>
              <span className="font-semibold text-foreground">
                {formatTomans(balance)}
              </span>
            </div>

            {error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive-soft p-3 text-xs text-destructive">
                {error}
              </div>
            ) : null}

            <DialogFooter className="gap-2">
              {insufficient ? (
                <TopUpDialog
                  trigger={<Button variant="outline">شارژ کیف پول</Button>}
                />
              ) : null}
              <Button onClick={confirm} disabled={insufficient}>
                تأیید و پرداخت {formatTomans(plan.price)}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
