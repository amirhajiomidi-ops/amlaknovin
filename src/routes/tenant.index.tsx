import { AdSlot } from "@/components/ads/ad-slot";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  CalendarClock,
  FileSignature,
  Handshake,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PropertyCard } from "@/components/property/property-card";
import { currentTenantFit, getProperty, properties } from "@/data/properties";
import {
  bookingStatusLabels,
  contractStatusLabels,
  contracts,
  offerStatusLabels,
  offers,
  savedProperties,
  tenantProfile,
  visitBookings,
} from "@/data/tenant";
import { formatCompactTomans, formatJalali, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/tenant/")({
  head: () => ({
    meta: [
      { title: "داشبورد مستأجر — املاک" },
      {
        name: "description",
        content:
          "خلاصه پروفایل مالی، بازدیدهای پیش‌رو، پیشنهادها و قراردادهای شما.",
      },
      { property: "og:title", content: "داشبورد مستأجر — املاک" },
      {
        property: "og:description",
        content: "خلاصه‌ای از فعالیت‌های شما در فرآیند اجاره امن.",
      },
    ],
  }),
  component: TenantDashboard,
});

function TenantDashboard() {
  const profileCompleteness = calcProfileCompleteness();
  const upcoming = visitBookings
    .filter((b) => b.status === "confirmed" || b.status === "requested")
    .sort((a, b) => a.date.localeCompare(b.date));
  const activeOffers = offers.filter(
    (o) => o.status === "sent" || o.status === "counter",
  );
  const pendingContracts = contracts.filter(
    (c) => c.status === "awaiting-signature" || c.status === "landlord-signed",
  );
  const savedList = savedProperties
    .map((id) => getProperty(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-6">
      {/* کارت پروفایل و آمادگی مالی */}
      <Card className="border-border">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                آمادگی پرونده اجاره شما
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                هر چه پروفایل کامل‌تر باشد، احتمال تأیید سریع‌تر مالک بیشتر است.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/tenant/profile">
                ویرایش پروفایل مالی
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">تکمیل پروفایل</span>
              <span className="font-semibold text-foreground">
                {toFaDigits(profileCompleteness)}٪
              </span>
            </div>
            <Progress value={profileCompleteness} className="mt-2 h-2" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ChecklistItem
              ok={tenantProfile.idVerified}
              label="احراز هویت"
              hint={tenantProfile.idVerified ? "تأییدشده" : "کارت ملی بارگذاری نشده"}
            />
            <ChecklistItem
              ok={tenantProfile.incomeVerified}
              label="تأیید درآمد"
              hint={
                tenantProfile.incomeVerified
                  ? "فیش حقوقی تأیید شد"
                  : "افزودن فیش سه ماه اخیر"
              }
            />
            <ChecklistItem
              ok={tenantProfile.guarantorAvailable}
              label="ضامن"
              hint={
                tenantProfile.guarantorAvailable
                  ? "معرفی‌شده"
                  : "برای رهن‌های سنگین لازم است"
              }
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryStat
              label="حداکثر ودیعه شما"
              value={formatCompactTomans(tenantProfile.maxDeposit)}
            />
            <SummaryStat
              label="حداکثر اجاره ماهانه"
              value={formatCompactTomans(tenantProfile.maxRent)}
            />
            <SummaryStat
              label="درآمد ماهانه"
              value={formatCompactTomans(tenantProfile.monthlyIncome)}
            />
          </div>
        </CardContent>
      </Card>

      {/* شاخص‌های سریع */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickTile
          icon={CalendarClock}
          label="بازدیدهای پیش‌رو"
          value={toFaDigits(upcoming.length)}
          to="/tenant/bookings"
        />
        <QuickTile
          icon={Handshake}
          label="پیشنهادهای فعال"
          value={toFaDigits(activeOffers.length)}
          to="/tenant/offers"
        />
        <QuickTile
          icon={FileSignature}
          label="قراردادهای در جریان"
          value={toFaDigits(pendingContracts.length + contracts.filter(c => c.status === "active").length)}
          to="/tenant/contracts"
        />
      </div>

      <AdSlot placement="panel-soft" size="leaderboard" />



      {/* بازدیدهای پیش‌رو */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            بازدیدهای پیش‌رو
          </h3>
          <Link
            to="/tenant/bookings"
            className="text-sm font-medium text-primary hover:underline"
          >
            مشاهده همه
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState text="در حال حاضر بازدیدی زمان‌بندی نشده است." />
        ) : (
          <ul className="divide-y divide-border">
            {upcoming.slice(0, 3).map((b) => {
              const p = getProperty(b.propertyId);
              if (!p) return null;
              return (
                <li key={b.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatJalali(b.date)} — {b.slot} • {b.channel}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      b.status === "confirmed"
                        ? "border-success/30 bg-success-soft text-success"
                        : "border-warning/30 bg-warning-soft text-warning"
                    }
                  >
                    {bookingStatusLabels[b.status]}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* پیشنهادها و قراردادها */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              پیشنهادهای اخیر
            </h3>
            <Link to="/tenant/offers" className="text-sm font-medium text-primary hover:underline">
              همه پیشنهادها
            </Link>
          </div>
          {offers.length === 0 ? (
            <EmptyState text="هنوز پیشنهادی ثبت نکرده‌اید." />
          ) : (
            <ul className="space-y-3">
              {offers.slice(0, 3).map((o) => {
                const p = getProperty(o.propertyId);
                if (!p) return null;
                return (
                  <li
                    key={o.id}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {p.title}
                      </p>
                      <Badge variant="outline">{offerStatusLabels[o.status]}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      ودیعه {formatCompactTomans(o.currentDeposit)} • اجاره {formatCompactTomans(o.currentRent)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">قراردادها</h3>
            <Link to="/tenant/contracts" className="text-sm font-medium text-primary hover:underline">
              مدیریت قراردادها
            </Link>
          </div>
          {contracts.length === 0 ? (
            <EmptyState text="هیچ قراردادی وجود ندارد." />
          ) : (
            <ul className="space-y-3">
              {contracts.slice(0, 3).map((c) => {
                const p = getProperty(c.propertyId);
                if (!p) return null;
                return (
                  <li
                    key={c.id}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{p.title}</p>
                      <Badge
                        variant="outline"
                        className={
                          c.status === "active"
                            ? "border-success/30 bg-success-soft text-success"
                            : "border-warning/30 bg-warning-soft text-warning"
                        }
                      >
                        {contractStatusLabels[c.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      از {formatJalali(c.startDate)} تا {formatJalali(c.endDate)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* نشان‌شده‌ها */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="size-5 text-primary" aria-hidden />
            <h3 className="text-base font-semibold text-foreground">
              فایل‌های نشان‌شده
            </h3>
          </div>
          <Link to="/search" className="text-sm font-medium text-primary hover:underline">
            ادامه جست‌وجو
          </Link>
        </div>
        {savedList.length === 0 ? (
          <EmptyState text="هنوز آگهی‌ای را نشان نکرده‌اید." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedList.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                fit={currentTenantFit[p.id]}
              />
            ))}
          </div>
        )}
      </section>

      {/* پیشنهاد بر اساس بودجه */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          متناسب با بودجه شما
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {properties
            .filter(
              (p) =>
                p.deposit <= tenantProfile.maxDeposit &&
                p.rent <= tenantProfile.maxRent &&
                p.status === "published",
            )
            .slice(0, 3)
            .map((p) => (
              <PropertyCard key={p.id} property={p} fit={currentTenantFit[p.id]} />
            ))}
        </div>
      </section>
    </div>
  );
}

function calcProfileCompleteness() {
  const checks = [
    Boolean(tenantProfile.fullName),
    Boolean(tenantProfile.nationalId),
    Boolean(tenantProfile.phone),
    tenantProfile.idVerified,
    tenantProfile.incomeVerified,
    tenantProfile.guarantorAvailable,
    tenantProfile.monthlyIncome > 0,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function ChecklistItem({
  ok,
  label,
  hint,
}: {
  ok: boolean;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
      <span
        className={`mt-0.5 grid size-8 place-items-center rounded-lg ${
          ok
            ? "bg-success-soft text-success"
            : "bg-warning-soft text-warning"
        }`}
        aria-hidden
      >
        {ok ? <BadgeCheck className="size-5" /> : <ShieldAlert className="size-5" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function QuickTile({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
  to: "/tenant/bookings" | "/tenant/offers" | "/tenant/contracts";
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </div>
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
      >
        <Icon className="size-5" />
      </span>
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-background/50 py-8 text-sm text-muted-foreground">
      <ShieldCheck className="me-2 size-4" aria-hidden />
      {text}
    </div>
  );
}
