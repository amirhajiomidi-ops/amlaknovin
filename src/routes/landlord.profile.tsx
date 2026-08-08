import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, IdCard, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppState } from "@/context/app-state";
import { toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/landlord/profile")({
  head: () => ({
    meta: [
      { title: "پروفایل و احراز هویت موجر — املاک" },
      {
        name: "description",
        content:
          "تکمیل پروفایل موجر و احراز هویت با کد ملی برای فعال‌سازی امکان ثبت آگهی ملک.",
      },
      { property: "og:title", content: "پروفایل و احراز هویت موجر — املاک" },
      {
        property: "og:description",
        content: "با ثبت کد ملی، هویت خود را تأیید کنید و آگهی ملک منتشر کنید.",
      },
    ],
  }),
  component: LandlordProfilePage,
});

function LandlordProfilePage() {
  const { user, verifyIdentity } = useAppState();
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState(user?.nationalId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verified = Boolean(user?.identityVerified);

  const submit = () => {
    const clean = nationalId.replace(/\D/g, "");
    if (!/^\d{10}$/.test(clean)) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      verifyIdentity(clean);
      toast.success("احراز هویت انجام شد؛ اکنون می‌توانید آگهی ثبت کنید.");
      void navigate({ to: "/list-property" });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">پروفایل و احراز هویت</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          برای انتشار آگهی، هویت شما باید با کد ملی تأیید شود.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>نام و نام خانوادگی</Label>
              <Input value={user?.fullName ?? ""} readOnly />
            </div>
            <div className="space-y-2">
              <Label>شماره موبایل</Label>
              <Input dir="ltr" className="text-start" value={user?.phone ?? ""} readOnly />
            </div>
          </div>

          {verified ? (
            <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-soft p-4 text-sm text-success">
              <BadgeCheck className="size-4" aria-hidden />
              هویت شما تأیید شده است. کد ملی:{" "}
              <span className="font-semibold">
                {toFaDigits(user?.nationalId ?? "")}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="nid">کد ملی</Label>
                <div className="relative">
                  <IdCard
                    aria-hidden
                    className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="nid"
                    dir="ltr"
                    inputMode="numeric"
                    maxLength={10}
                    className="pe-10 text-start"
                    placeholder="0012345678"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                  />
                </div>
              </div>
              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive-soft p-3 text-xs text-destructive"
                >
                  {error}
                </div>
              ) : null}
              <Button onClick={submit} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <ShieldCheck className="size-4" aria-hidden />
                )}
                تأیید هویت
              </Button>
            </div>
          )}

          <p className="text-xs leading-6 text-muted-foreground">
            نسخه نمایشی: اطلاعات هویتی فقط در همین مرورگر ذخیره می‌شود.
          </p>

          {verified ? (
            <Button asChild variant="outline">
              <Link to="/list-property">ثبت آگهی جدید</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
