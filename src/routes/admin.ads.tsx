import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart3, Megaphone, MousePointerClick } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adCampaigns,
  campaignStatusLabels,
  placementLabels,
  type AdPlacement,
  type CampaignStatus,
} from "@/data/ads";
import { formatJalali, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/admin/ads")({
  head: () => ({
    meta: [
      { title: "مدیریت تبلیغات (دمو) — املاک" },
      {
        name: "description",
        content:
          "پنل دمو مدیریت کمپین‌های تبلیغاتی: جایگاه، بازه زمانی، وضعیت و آمار نمایش و کلیک.",
      },
      { property: "og:title", content: "مدیریت تبلیغات (دمو) — املاک" },
      {
        property: "og:description",
        content: "لیست کمپین‌های تبلیغاتی پلتفرم املاک با جایگاه و آمار نمایشی.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAdsPage,
});

const statusTone: Record<CampaignStatus, string> = {
  active: "border-success/30 bg-success-soft text-success",
  scheduled: "border-primary/30 bg-primary-soft text-primary",
  paused: "border-warning/30 bg-warning-soft text-warning",
  ended: "border-border bg-muted text-muted-foreground",
};

function AdminAdsPage() {
  const [status, setStatus] = useState<CampaignStatus | "all">("all");
  const [placement, setPlacement] = useState<AdPlacement | "all">("all");

  const rows = useMemo(
    () =>
      adCampaigns
        .filter((c) => (status === "all" ? true : c.status === status))
        .filter((c) => (placement === "all" ? true : c.placement === placement)),
    [status, placement],
  );

  const totals = rows.reduce(
    (acc, c) => ({
      impressions: acc.impressions + c.impressions,
      clicks: acc.clicks + c.clicks,
    }),
    { impressions: 0, clicks: 0 },
  );
  const ctr =
    totals.impressions > 0
      ? ((totals.clicks / totals.impressions) * 100).toFixed(2)
      : "0";

  return (
    <div className="app-container space-y-6 py-8 md:py-12">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          پنل دمو
        </div>
        <h1 className="mt-1 text-2xl font-bold text-foreground md:text-3xl">
          مدیریت تبلیغات
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          این صفحه فقط نمایشی است و کمپین‌ها با داده‌های آزمایشی نشان داده
          می‌شوند.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={Megaphone}
          label="کمپین‌های نمایش‌داده‌شده"
          value={toFaDigits(rows.length)}
        />
        <Stat
          icon={BarChart3}
          label="مجموع نمایش"
          value={toFaDigits(new Intl.NumberFormat("en-US").format(totals.impressions))}
        />
        <Stat
          icon={MousePointerClick}
          label="نرخ کلیک (CTR)"
          value={`${toFaDigits(ctr)}٪`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as CampaignStatus | "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            {(
              Object.keys(campaignStatusLabels) as CampaignStatus[]
            ).map((s) => (
              <SelectItem key={s} value={s}>
                {campaignStatusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={placement}
          onValueChange={(v) => setPlacement(v as AdPlacement | "all")}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه جایگاه‌ها</SelectItem>
            {(Object.keys(placementLabels) as AdPlacement[]).map((p) => (
              <SelectItem key={p} value={p}>
                {placementLabels[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[760px] text-start text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <Th>تبلیغ‌دهنده</Th>
              <Th>جایگاه</Th>
              <Th>بازه</Th>
              <Th>وضعیت</Th>
              <Th>نمایش</Th>
              <Th>کلیک</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <Td className="font-medium text-foreground">{c.advertiser}</Td>
                <Td>{placementLabels[c.placement]}</Td>
                <Td className="whitespace-nowrap text-xs">
                  {formatJalali(c.from)} تا {formatJalali(c.to)}
                </Td>
                <Td>
                  <Badge
                    variant="outline"
                    className={statusTone[c.status]}
                  >
                    {campaignStatusLabels[c.status]}
                  </Badge>
                </Td>
                <Td>{toFaDigits(new Intl.NumberFormat("en-US").format(c.impressions))}</Td>
                <Td>{toFaDigits(new Intl.NumberFormat("en-US").format(c.clicks))}</Td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-sm text-muted-foreground"
                >
                  کمپینی با این فیلترها یافت نشد.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          پیش‌نمایش جایگاه‌ها
        </h2>
        <AdSlot placement="home-leaderboard" size="leaderboard" />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdSlot placement="search-inline" size="inline" />
          <AdSlot placement="search-sidebar" size="sidebar" />
        </div>
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-3 text-start font-medium">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`p-3 text-muted-foreground ${className}`}>{children}</td>;
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Megaphone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        {label}
      </div>
      <div className="mt-2 text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}
