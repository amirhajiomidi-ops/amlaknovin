import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Info, ShieldAlert, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppState, type TenantDocs } from "@/context/app-state";
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
        content: "درآمد، بودجه، کد ملی و مدارک هویتی خود را در پنل مدیریت کنید.",
      },
    ],
  }),
  component: TenantProfilePage,
});

function TenantProfilePage() {
  const { user, verifyIdentity, tenantDocs, setTenantDoc } = useAppState();
  const navigate = useNavigate();
  const safeBudget = Math.round(tenantProfile.monthlyIncome * 0.4);

  const [nationalId, setNationalId] = useState(user?.nationalId ?? "");
  const [error, setError] = useState<string | null>(null);
  const verified = Boolean(user?.identityVerified);

  const submitIdentity = () => {
    const clean = nationalId.replace(/\D/g, "");
    if (!/^\d{10}$/.test(clean)) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }
    if (!tenantDocs.credit) {
      setError("برای احراز هویت، مدرک اعتبارسنجی را بارگذاری کنید.");
      return;
    }
    setError(null);
    verifyIdentity(clean);
    toast.success("هویت شما تأیید شد. اکنون می‌توانید جزئیات آگهی‌ها را ببینید.");
    const back = sessionStorage.getItem("amlak-return-to");
    if (back) {
      sessionStorage.removeItem("amlak-return-to");
      void navigate({ to: back });
    }
  };

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
                تا زمانی که احراز هویت کامل نشود، امکان مشاهده جزئیات آگهی، ثبت
                پیشنهاد و رزرو بازدید وجود ندارد.
              </p>
            </div>
            {verified ? (
              <Badge className="border-success/30 bg-success-soft text-success" variant="outline">
                <BadgeCheck className="me-1 size-3.5" aria-hidden />
                هویت تأیید شده
              </Badge>
            ) : (
              <Badge variant="outline" className="border-warning/30 bg-warning-soft text-warning">
                در انتظار احراز هویت
              </Badge>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" defaultValue={user?.fullName ?? tenantProfile.fullName} />
            <Field label="شماره همراه" defaultValue={toFaDigits(user?.phone ?? tenantProfile.phone)} />
            <Field label="نوع اشتغال" defaultValue={tenantProfile.employmentType} />
          </div>

          <Separator className="my-5" />

          {verified ? (
            <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
              <ShieldCheck className="size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">احراز هویت انجام شد</p>
                <p className="mt-0.5 text-xs opacity-90">
                  کد ملی ثبت‌شده: {toFaDigits(user?.nationalId ?? "")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="tenant-national-id">کد ملی (۱۰ رقم)</Label>
                <Input
                  id="tenant-national-id"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="۰۰۱۲۳۴۵۶۷۸"
                  value={nationalId}
                  onChange={(e) => {
                    setNationalId(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setError(null);
                  }}
                  className="bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  کد ملی فقط برای اعتبارسنجی و تأیید هویت استفاده می‌شود.
                </p>
              </div>
              {error ? (
                <p className="text-xs font-medium text-destructive">{error}</p>
              ) : null}
              <Button onClick={submitIdentity}>
                <ShieldCheck className="size-4" aria-hidden />
                تأیید هویت
              </Button>
            </div>
          )}
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
          <h2 className="text-lg font-semibold text-foreground">مدارک</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            مدارک شما فقط برای فرآیند تأیید توسط پلتفرم و مالک استفاده می‌شوند.
          </p>

          <div className="mt-5 space-y-3">
            <DocumentRow
              docKey="payslip"
              title="فیش حقوقی سه ماه اخیر"
              hint="برای ارزیابی توان پرداخت اجاره لازم است."
              fileName={tenantDocs.payslip}
              onUpload={setTenantDoc}
            />
            <DocumentRow
              docKey="credit"
              title="مدرک اعتبارسنجی"
              hint="برای تکمیل احراز هویت الزامی است."
              fileName={tenantDocs.credit}
              onUpload={setTenantDoc}
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

function DocumentRow({
  docKey,
  title,
  hint,
  fileName,
  onUpload,
}: {
  docKey: keyof TenantDocs;
  title: string;
  hint: string;
  fileName: string | null;
  onUpload: (key: keyof TenantDocs, name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploaded = Boolean(fileName);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-3">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-9 place-items-center rounded-lg ${
            uploaded
              ? "border-success/30 bg-success-soft text-success"
              : "border-destructive/30 bg-destructive-soft text-destructive"
          }`}
          aria-hidden
        >
          {uploaded ? <BadgeCheck className="size-4" /> : <ShieldAlert className="size-4" />}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {uploaded ? fileName : hint}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={
            uploaded
              ? "border-success/30 bg-success-soft text-success"
              : "border-destructive/30 bg-destructive-soft text-destructive"
          }
        >
          {uploaded ? "بارگذاری شد" : "بارگذاری نشده"}
        </Badge>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              onUpload(docKey, f.name);
              toast.success("مدرک بارگذاری شد.");
            }
            e.target.value = "";
          }}
        />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload className="size-4" aria-hidden />
          {uploaded ? "تعویض" : "بارگذاری"}
        </Button>
      </div>
    </div>
  );
}
