import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RotateCcw, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/context/app-state";
import { topupPackages, walletTxLabels, type WalletTxType } from "@/data/wallet";
import { formatJalali, formatTomans, toFaDigits } from "@/lib/format";

export function TopUpDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const { topUp } = useAppState();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(topupPackages[1]);
  const [custom, setCustom] = useState<string>("");
  const [paying, setPaying] = useState(false);

  const finalAmount = custom ? Number(custom.replace(/\D/g, "")) : amount;

  const confirm = () => {
    if (!finalAmount || finalAmount < 50_000) return;
    setPaying(true);
    window.setTimeout(() => {
      topUp(finalAmount);
      setPaying(false);
      setOpen(false);
      setCustom("");
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm">شارژ کیف پول</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>شارژ کیف پول</DialogTitle>
          <DialogDescription>
            مبلغ مورد نظر را انتخاب کنید. پرداخت در این نسخه شبیه‌سازی می‌شود.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {topupPackages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                !custom && amount === p
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {formatTomans(p)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground" htmlFor="custom-amount">
            یا مبلغ دلخواه (تومان)
          </label>
          <Input
            id="custom-amount"
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="مثلاً ۷۵۰۰۰۰"
          />
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          مبلغ نهایی:{" "}
          <span className="font-semibold text-foreground">
            {finalAmount ? formatTomans(finalAmount) : "—"}
          </span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            انصراف
          </Button>
          <Button onClick={confirm} disabled={paying || !finalAmount}>
            {paying ? "در حال اتصال به درگاه…" : "پرداخت و شارژ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WalletPanel({ audience }: { audience: "tenant" | "landlord" }) {
  const { balance, transactions } = useAppState();
  const [filter, setFilter] = useState<WalletTxType | "all">("all");

  const rows = useMemo(
    () =>
      filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter),
    [transactions, filter],
  );

  const spent = transactions
    .filter((t) => t.type === "spend")
    .reduce((s, t) => s + t.amount, 0);

  const icon: Record<WalletTxType, typeof ArrowUpRight> = {
    topup: ArrowDownLeft,
    spend: ArrowUpRight,
    refund: RotateCcw,
  };
  const tone: Record<WalletTxType, string> = {
    topup: "text-success",
    spend: "text-destructive",
    refund: "text-primary",
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/20 bg-primary-soft p-5 md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Wallet className="size-4" aria-hidden />
            موجودی کیف پول
          </div>
          <div className="mt-3 text-2xl font-bold text-foreground">
            {formatTomans(balance)}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {audience === "landlord"
              ? "از این موجودی برای خرید طرح‌های ارتقای آگهی استفاده می‌شود."
              : "از این موجودی برای خدمات پرداخت امن و هزینه‌های سرویس استفاده می‌شود."}
          </p>
          <div className="mt-4">
            <TopUpDialog />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs text-muted-foreground">مجموع هزینه‌ها</div>
          <div className="mt-2 text-lg font-bold text-foreground">
            {formatTomans(spent)}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            تعداد تراکنش‌ها: {toFaDigits(transactions.length)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <h2 className="text-sm font-semibold text-foreground">تراکنش‌ها</h2>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as WalletTxType | "all")}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="نوع تراکنش" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه تراکنش‌ها</SelectItem>
              <SelectItem value="topup">شارژ</SelectItem>
              <SelectItem value="spend">کسر بابت طرح</SelectItem>
              <SelectItem value="refund">بازگشت وجه</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            تراکنشی با این فیلتر یافت نشد.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((t) => {
              const Icon = icon[t.type];
              return (
                <li key={t.id} className="flex items-center gap-3 p-4">
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-background ${tone[t.type]}`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {t.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {walletTxLabels[t.type]} · {formatJalali(t.at)}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${tone[t.type]}`}>
                    {t.type === "spend" ? "−" : "+"} {formatTomans(t.amount)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
