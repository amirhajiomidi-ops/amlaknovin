import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Info, ShieldAlert, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { tenantProfile } from "@/data/tenant";
import { formatCompactTomans, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/tenant/profile")({
  head: () => ({
    meta: [
      { title: "پروفایل مالی مستأجر — املاک" },
      {
        name: "description",
        content: "تکمیل پروفایل مالی برای دریافت پیشنهادهای متناسب و تأیید سریع‌تر.",
      },
      { property: "og:title", content: "پروفایل مالی مستأجر — املاک" },
      {
        property: "og:description",
        content: "درآمد، بودجه، ضامن و مدارک هویتی خود را در پنل مدیریت کنید.",
      },
    ],
  }),
  component: TenantProfilePage,
});

function TenantProfilePage() {
  const safeBudget = Math.round(tenantProfile.monthlyIncome * 0.4);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                هویت و اطلاعات پایه
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                برای تأیید سریع‌تر مالک، این بخش را کامل نگه‌دارید.
              </p>
            </div>
            {tenantProfile.idVerified ? (
              <Badge className="border-success/30 bg-success-soft text-success" variant="outline">
                <BadgeCheck className="me-1 size-3.5" aria-hidden />
                هویت تأیید شده
              </Badge>
            ) : (
              <Badge variant="outline" className="border-warning/30 bg-warning-soft text-warning">
                در انتظار تأیید
              </Badge>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" defaultValue={tenantProfile.fullName} />
            <Field label="کد ملی" defaultValue={tenantProfile.nationalId} />
            <Field label="شماره همراه" defaultValue={tenantProfile.phone} />
            <Field label="نوع اشتغال" defaultValue={tenantProfile.employmentType} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-foreground">
            توان مالی و بودجه
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            بر اساس درآمد و پس‌انداز، فایل‌های متناسب به شما پیشنهاد می‌شود.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatCard label="درآمد ماهانه" value={formatCompactTomans(tenantProfile.monthlyIncome)} />
            <StatCard label="حداکثر ودیعه" value={formatCompactTomans(tenantProfile.maxDeposit)} />
            <StatCard label="حداکثر اجاره" value={formatCompactTomans(tenantProfile.maxRent)} />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              پیشنهاد ما: اجاره ماهانه بیش از {toFaDigits(40)}٪ درآمد نباشد. با
              این معیار سقف امن شما حدود {formatCompactTomans(safeBudget)} در ماه است.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-foreground">
            مدارک و ضمانت
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            مدارک شما فقط برای فرآیند تأیید توسط پلتفرم و مالک استفاده می‌شوند.
          </p>

          <div className="mt-5 space-y-3">
            <DocumentRow
              title="فیش حقوقی سه ماه اخیر"
              status={tenantProfile.incomeVerified ? "verified" : "missing"}
              hint="با تأیید این مورد، شانس اجاره حرفه‌ای بیشتر می‌شود."
            />
            <DocumentRow
              title="گواهی اشتغال"
              status="review"
              hint="در حال بررسی توسط تیم پشتیبانی."
            />
            <DocumentRow
              title="ضامن معتبر"
              status={tenantProfile.guarantorAvailable ? "verified" : "missing"}
              hint="برای ودیعه‌های بالای ۳ میلیارد الزامی است."
            />
          </div>

          <Separator className="my-5" />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background p-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  اجازه اشتراک‌گذاری خلاصه اعتبار با مالک
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  تنها امتیاز کلی و وضعیت تأیید مدارک به مالک نمایش داده می‌شود.
                </p>
              </div>
            </div>
            <Switch defaultChecked aria-label="اشتراک خلاصه اعتبار" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold text-foreground">امتیاز اعتباری</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            محاسبه بر پایه سابقه پرداخت اجاره‌های قبلی و مدارک تأییدشده.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-full bg-success-soft text-2xl font-bold text-success">
              {toFaDigits(tenantProfile.creditScore)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>ضعیف</span>
                <span>عالی</span>
              </div>
              <Progress
                value={(tenantProfile.creditScore / 1000) * 100}
                className="mt-2 h-2"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                امتیاز شما در بازه «خوب» قرار دارد. با تأیید فیش حقوقی می‌تواند بالاتر برود.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">انصراف</Button>
        <Button>ذخیره تغییرات</Button>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input defaultValue={defaultValue} className="bg-background" readOnly />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

type DocStatus = "verified" | "review" | "missing";

function DocumentRow({
  title,
  status,
  hint,
}: {
  title: string;
  status: DocStatus;
  hint: string;
}) {
  const cfg: Record<DocStatus, { label: string; className: string; icon: typeof BadgeCheck }> = {
    verified: {
      label: "تأییدشده",
      className: "border-success/30 bg-success-soft text-success",
      icon: BadgeCheck,
    },
    review: {
      label: "در حال بررسی",
      className: "border-warning/30 bg-warning-soft text-warning",
      icon: Info,
    },
    missing: {
      label: "بارگذاری نشده",
      className: "border-destructive/30 bg-destructive-soft text-destructive",
      icon: ShieldAlert,
    },
  };
  const c = cfg[status];
  const Icon = c.icon;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-9 place-items-center rounded-lg ${c.className}`}
          aria-hidden
        >
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={c.className}>
          {c.label}
        </Badge>
        <Button variant="outline" size="sm">
          <Upload className="size-4" aria-hidden />
          بارگذاری
        </Button>
      </div>
    </div>
  );
}
