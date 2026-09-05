import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Building2,
  KeyRound,
  Loader2,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppState, type UserRole } from "@/context/app-state";
import { toFaDigits } from "@/lib/format";

type Mode = "login" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search["mode"] === "signup" ? "signup" : "login") as Mode,
  }),
  head: () => ({
    meta: [
      { title: "ورود و ثبت‌نام — املاک" },
      {
        name: "description",
        content:
          "با شماره موبایل وارد پلتفرم املاک شوید؛ ورود امن با رمز یک‌بارمصرف برای مستأجر و موجر.",
      },
      { property: "og:title", content: "ورود و ثبت‌نام — املاک" },
      {
        property: "og:description",
        content: "ورود امن با شماره موبایل و رمز یک‌بارمصرف در پلتفرم املاک.",
      },
    ],
  }),
  component: AuthPage,
});

type Step = "phone" | "otp";

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn, findAccount } = useAppState();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<UserRole>("tenant");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  const sendOtp = () => {
    const clean = phone.replace(/\D/g, "");
    if (!/^09\d{9}$/.test(clean)) {
      setError("شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد.");
      return;
    }
    if (mode === "signup" && fullName.trim().length < 3) {
      setError("نام و نام خانوادگی را کامل وارد کنید.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setSeconds(90);
    }, 700);
  };

  const verifyOtp = () => {
    if (otp.length !== 5) {
      setError("کد ۵ رقمی را کامل وارد کنید.");
      return;
    }
    if (otp !== "12345") {
      setError("کد واردشده صحیح نیست. کد آزمایشی: ۱۲۳۴۵");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (mode === "signup") {
        signIn({
          fullName: fullName.trim(),
          phone,
          roles: [role],
          activeRole: role,
          identityVerified: false,
        });
        navigate({ to: role === "landlord" ? "/landlord" : "/tenant" });
        return;
      }
      // ورود: نقش از حساب قبلی خوانده می‌شود (پیش‌فرض: مستأجر)
      const account = findAccount(phone);
      const nextRole: UserRole = account?.activeRole ?? "tenant";
      signIn(
        account ?? {
          fullName: "کاربر املاک",
          phone,
          roles: [nextRole],
          activeRole: nextRole,
        },
      );
      navigate({ to: nextRole === "landlord" ? "/landlord" : "/tenant" });
    }, 700);
  };




  return (
    <div className="app-container py-10 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="hidden lg:block">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            حساب کاربری امن
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground">
            ورود با شماره موبایل، بدون رمز عبور
          </h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            هویت شما با رمز یک‌بارمصرف تأیید می‌شود. اطلاعات مالی و مدارک فقط پس از
            احراز هویت در دسترس طرف مقابل قرار می‌گیرد.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-foreground">
            {[
              "ورود امن با رمز یک‌بارمصرف",
              "نمایش شماره تماس فقط پس از تأیید طرفین",
              "امکان انتخاب نقش مستأجر یا موجر",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-elevated md:p-8">
          <div className="mb-6 flex rounded-xl border border-border bg-background p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  navigate({ to: "/auth", search: { mode: m } });
                  setStep("phone");
                  setOtp("");
                  setError(null);
                }}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {m === "login" ? "ورود" : "ثبت‌نام"}
              </button>
            ))}
          </div>

          <ol className="mb-6 flex items-center gap-2 text-[11px] text-muted-foreground">
            {[mode === "signup" ? "اطلاعات حساب" : "شماره موبایل", "کد تأیید"].map(
              (label, i) => {
                const idx = ["phone", "otp"].indexOf(step);
                const active = i <= idx;
                return (
                  <li key={label} className="flex flex-1 items-center gap-2">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {toFaDigits(i + 1)}
                    </span>
                    <span className={active ? "text-foreground" : ""}>{label}</span>
                  </li>
                );
              },
            )}
          </ol>

          {step === "phone" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">شماره موبایل</Label>
                <div className="relative">
                  <Smartphone
                    aria-hidden
                    className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="phone"
                    inputMode="tel"
                    dir="ltr"
                    className="pe-10 text-start"
                    placeholder="09123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {mode === "signup" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثلاً نگین شریفی"
                    />
                  </div>
                  <RolePicker role={role} onChange={setRole} />
                </>
              ) : null}




              {error ? <ErrorBox text={error} /> : null}

              <Button className="w-full" onClick={sendOtp} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <KeyRound className="size-4" aria-hidden />
                )}
                دریافت کد تأیید
              </Button>
              <p className="text-center text-[11px] leading-6 text-muted-foreground">
                با ادامه، قوانین استفاده و سیاست حفظ حریم خصوصی املاک را می‌پذیرید.
              </p>
            </div>
          ) : null}

          {step === "otp" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                کد ۵ رقمی به شماره{" "}
                <span dir="ltr" className="font-semibold text-foreground">
                  {phone}
                </span>{" "}
                ارسال شد.
              </p>
              <div className="flex justify-center" dir="ltr">
                <InputOTP maxLength={5} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
                نسخه نمایشی: کد تأیید همیشه <b className="text-foreground">۱۲۳۴۵</b> است.
              </div>

              {error ? <ErrorBox text={error} /> : null}

              <Button className="w-full" onClick={verifyOtp} disabled={loading}>
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <BadgeCheck className="size-4" aria-hidden />
                )}
                تأیید و ادامه
              </Button>
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  className="text-muted-foreground hover:underline"
                  onClick={() => setStep("phone")}
                >
                  ویرایش شماره
                </button>
                <button
                  type="button"
                  disabled={seconds > 0}
                  onClick={() => setSeconds(90)}
                  className="font-medium text-primary disabled:text-muted-foreground disabled:no-underline hover:underline"
                >
                  {seconds > 0
                    ? `ارسال مجدد تا ${toFaDigits(seconds)} ثانیه`
                    : "ارسال مجدد کد"}
                </button>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}

function RolePicker({
  role,
  onChange,
}: {
  role: UserRole;
  onChange: (r: UserRole) => void;
}) {
  const options: Array<{
    id: UserRole;
    title: string;
    body: string;
    icon: typeof UserRound;
  }> = [
    {
      id: "tenant",
      title: "مستأجر",
      body: "جست‌وجو، بازدید و اجاره",
      icon: UserRound,
    },
    {
      id: "landlord",
      title: "موجر",
      body: "ثبت ملک و مدیریت آگهی",
      icon: Building2,
    },
  ];
  return (
    <div className="space-y-2">
      <Label>نقش شما</Label>
      <div role="radiogroup" className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const Icon = o.icon;
          const active = role === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.id)}
              className={`relative rounded-xl border-2 p-3 text-start transition-colors ${
                active
                  ? "border-primary bg-primary-soft ring-2 ring-primary/25"
                  : "border-border bg-background hover:bg-secondary"
              }`}
            >
              {active ? (
                <BadgeCheck
                  className="absolute start-2 top-2 size-4 text-primary"
                  aria-hidden
                />
              ) : null}
              <Icon
                className={`size-4 ${active ? "text-primary" : "text-muted-foreground"}`}
                aria-hidden
              />
              <div
                className={`mt-2 text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}
              >
                {o.title}
              </div>
              <div className="text-[11px] text-muted-foreground">{o.body}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


function ErrorBox({ text }: { text: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive-soft p-3 text-xs text-destructive"
    >
      {text}
    </div>
  );
}
