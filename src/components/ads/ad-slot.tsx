import { Megaphone } from "lucide-react";

import { adsFor, type AdPlacement } from "@/data/ads";

type Size = "leaderboard" | "inline" | "sidebar" | "sticky";

interface Props {
  placement: AdPlacement;
  size: Size;
  index?: number;
  className?: string;
}

const accentClass: Record<string, string> = {
  primary: "border-primary/25 bg-primary-soft text-primary",
  accent: "border-accent/25 bg-accent-soft text-accent",
  success: "border-success/25 bg-success-soft text-success",
  warning: "border-warning/25 bg-warning-soft text-warning",
};

function AdLabel() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Megaphone className="size-3" aria-hidden />
      تبلیغ
    </span>
  );
}

export function AdSlot({ placement, size, index = 0, className = "" }: Props) {
  const pool = adsFor(placement);
  if (pool.length === 0) {
    // جایگاه خالی: فضایی محفوظ بدون آزار بصری
    return (
      <div
        className={`rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground ${className}`}
      >
        این جایگاه تبلیغاتی خالی است
      </div>
    );
  }
  const ad = pool[index % pool.length];
  const tone = accentClass[ad.accent] ?? accentClass.primary;

  if (size === "sticky") {
    return (
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 backdrop-blur md:hidden ${className}`}
        role="complementary"
        aria-label="تبلیغ"
      >
        <div className="flex items-center gap-3">
          <div className={`grid size-9 shrink-0 place-items-center rounded-lg border ${tone}`}>
            <Megaphone className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-foreground">
              {ad.title}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {ad.advertiser}
            </div>
          </div>
          <AdLabel />
        </div>
      </div>
    );
  }

  if (size === "leaderboard") {
    return (
      <aside
        aria-label="تبلیغ"
        className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border ${tone} p-5 ${className}`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <AdLabel />
            <span className="text-[11px] text-muted-foreground">
              {ad.category}
            </span>
          </div>
          <h3 className="mt-2 text-base font-bold text-foreground md:text-lg">
            {ad.title}
          </h3>
          <p className="mt-1 text-xs leading-6 text-muted-foreground md:text-sm">
            {ad.body}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{ad.advertiser}</span>
          <button
            type="button"
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background"
          >
            {ad.cta}
          </button>
        </div>
      </aside>
    );
  }

  // inline & sidebar
  return (
    <aside
      aria-label="تبلیغ"
      className={`rounded-2xl border ${tone} p-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <AdLabel />
        <span className="text-[11px] text-muted-foreground">{ad.category}</span>
      </div>
      <h3 className="mt-3 text-sm font-bold text-foreground">{ad.title}</h3>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{ad.body}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {ad.advertiser}
        </span>
        <button
          type="button"
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground"
        >
          {ad.cta}
        </button>
      </div>
    </aside>
  );
}
