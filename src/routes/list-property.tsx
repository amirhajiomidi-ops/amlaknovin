import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppState } from "@/context/app-state";
import { AvailabilityEditor } from "@/components/property/availability-editor";
import { type DayAvailability } from "@/data/availability";
import { cities, neighborhoodsByCity } from "@/data/properties";
import { formatCompactTomans, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/list-property")({
  head: () => ({
    meta: [
      { title: "ثبت ملک — املاک" },
      {
        name: "description",
        content:
          "ملک خود را با احراز مالک و فایل در پلتفرم املاک منتشر کنید و مستقیماً با مستأجران معتبر مذاکره کنید.",
      },
      { property: "og:title", content: "ثبت ملک — املاک" },
      {
        property: "og:description",
        content:
          "فرم چندمرحله‌ای ثبت ملک: اطلاعات، امکانات، شرایط مالی، مدارک مالکیت و انتشار.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ListPropertyPage,
});

const stepTitles = [
  "اطلاعات ملک",
  "امکانات",
  "شرایط مالی",
  "مدارک مالکیت",
  "پیش‌نمایش و ارسال",
];

const amenityOptions = [
  "بالکن",
  "کمد دیواری",
  "سیستم گرمایش از کف",
  "کولر گازی",
  "لابی و نگهبانی",
  "روف‌گاردن",
  "بازسازی‌شده",
  "مناسب خانواده",
];

interface FormState {
  title: string;
  city: string;
  neighborhood: string;
  approxLocation: string;
  area: string;
  rooms: string;
  floor: string;
  totalFloors: string;
  yearBuilt: string;
  elevator: boolean;
  parking: boolean;
  storage: boolean;
  amenities: string[];
  description: string;
  dealType: "rent" | "mortgage";
  deposit: string;
  rent: string;
  negotiable: boolean;
  ownerDoc: boolean;
  idDoc: boolean;
  nationalId: string;
  bookingEnabled: boolean;
  onlineTour: boolean;
  availability: DayAvailability;
}

const initialForm: FormState = {
  title: "",
  city: "",
  neighborhood: "",
  approxLocation: "",
  area: "",
  rooms: "",
  floor: "",
  totalFloors: "",
  yearBuilt: "",
  elevator: false,
  parking: false,
  storage: false,
  amenities: [],
  description: "",
  dealType: "rent",
  deposit: "",
  rent: "",
  negotiable: true,
  ownerDoc: false,
  idDoc: false,
  nationalId: "",
  bookingEnabled: true,
  onlineTour: false,
  availability: {},
};

function ListPropertyPage() {
  const { user, setPropertyAvailability } = useAppState();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (user?.nationalId) {
      setForm((f) => (f.nationalId ? f : { ...f, nationalId: user.nationalId! }));
    }
  }, [user?.nationalId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (s: number): string[] => {
    const e: string[] = [];
    if (s === 0) {
      if (form.title.trim().length < 8)
        e.push("عنوان آگهی باید حداقل ۸ نویسه باشد.");
      if (!form.city) e.push("شهر را انتخاب کنید.");
      if (!form.neighborhood) e.push("محله را انتخاب کنید.");
      if (!form.area || Number(form.area) < 20)
        e.push("متراژ معتبر (حداقل ۲۰ متر) وارد کنید.");
      if (form.rooms === "") e.push("تعداد اتاق را وارد کنید.");
    }
    if (s === 2) {
      if (!form.deposit || Number(form.deposit) <= 0)
        e.push("مبلغ ودیعه را وارد کنید.");
      if (form.dealType === "rent" && (!form.rent || Number(form.rent) <= 0))
        e.push("اجاره ماهانه را وارد کنید.");
    }
    if (s === 3) {
      if (!form.ownerDoc) e.push("بارگذاری سند مالکیت الزامی است.");
      if (!form.idDoc) e.push("بارگذاری مدرک هویتی الزامی است.");
      if (!/^\d{10}$/.test(form.nationalId))
        e.push("کد ملی باید ۱۰ رقم باشد.");
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (e.length === 0) setStep((s) => Math.min(s + 1, stepTitles.length - 1));
  };

  const submit = () => {
    setSubmitting(true);
    const newId = `new-${Date.now()}`;
    if (form.bookingEnabled && Object.keys(form.availability).length > 0) {
      setPropertyAvailability(newId, form.availability);
    }
    window.setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1200);
  };

  if (!user) {
    return <AuthGate />;
  }

  if (user.role === "landlord" && !user.identityVerified) {
    return <VerifyGate />;
  }

  if (!started) {
    return <Intro onStart={() => setStarted(true)} />;
  }

  if (done) {
    return (
      <div className="app-container py-14">
        <Card className="mx-auto max-w-xl border-success/30 bg-success-soft/40">
          <CardContent className="space-y-4 p-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
            <h1 className="text-xl font-bold text-foreground">
              آگهی شما برای بازبینی ارسال شد
            </h1>
            <p className="text-sm leading-7 text-muted-foreground">
              کارشناسان ما مدارک مالکیت را بررسی می‌کنند. نتیجه‌ی بازبینی حداکثر
              تا ۲۴ ساعت آینده در پنل موجر اعلام می‌شود.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/landlord/properties">رفتن به ملک‌های من</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(initialForm);
                  setStep(0);
                  setDone(false);
                }}
              >
                ثبت ملک دیگر
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            ثبت ملک
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            گام {toFaDigits(step + 1)} از {toFaDigits(stepTitles.length)} —{" "}
            {stepTitles[step]}
          </p>
        </div>

        <ol className="flex flex-wrap items-center gap-2">
          {stepTitles.map((t, i) => (
            <li
              key={t}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                i === step
                  ? "border-primary bg-primary-soft text-primary"
                  : i < step
                    ? "border-success/30 bg-success-soft text-success"
                    : "border-border bg-surface text-muted-foreground"
              }`}
            >
              <span className="font-semibold">{toFaDigits(i + 1)}</span>
              {t}
            </li>
          ))}
        </ol>

        {errors.length > 0 ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive-soft p-4 text-xs leading-6 text-destructive">
            <ul className="list-inside list-disc space-y-1">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <Card>
          <CardContent className="space-y-5 p-6">
            {step === 0 ? (
              <>
                <Field label="عنوان آگهی">
                  <Input
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="مثلاً: آپارتمان ۹۰ متری نوساز در سعادت‌آباد"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="شهر">
                    <Select
                      value={form.city}
                      onValueChange={(v) => {
                        set("city", v);
                        set("neighborhood", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب شهر" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="محله">
                    <Select
                      value={form.neighborhood}
                      onValueChange={(v) => set("neighborhood", v)}
                      disabled={!form.city}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب محله" />
                      </SelectTrigger>
                      <SelectContent>
                        {(neighborhoodsByCity[form.city] ?? []).map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label="موقعیت تقریبی (برای حفظ حریم خصوصی)">
                  <Input
                    value={form.approxLocation}
                    onChange={(e) => set("approxLocation", e.target.value)}
                    placeholder="مثلاً: نزدیک میدان کاج"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="متراژ (متر)">
                    <Input
                      inputMode="numeric"
                      value={form.area}
                      onChange={(e) => set("area", digits(e.target.value))}
                    />
                  </Field>
                  <Field label="تعداد اتاق">
                    <Input
                      inputMode="numeric"
                      value={form.rooms}
                      onChange={(e) => set("rooms", digits(e.target.value))}
                    />
                  </Field>
                  <Field label="سال ساخت">
                    <Input
                      inputMode="numeric"
                      value={form.yearBuilt}
                      onChange={(e) => set("yearBuilt", digits(e.target.value))}
                      placeholder="۱۴۰۰"
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="طبقه">
                    <Input
                      inputMode="numeric"
                      value={form.floor}
                      onChange={(e) => set("floor", digits(e.target.value))}
                    />
                  </Field>
                  <Field label="تعداد کل طبقات">
                    <Input
                      inputMode="numeric"
                      value={form.totalFloors}
                      onChange={(e) =>
                        set("totalFloors", digits(e.target.value))
                      }
                    />
                  </Field>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <CheckRow
                    id="elevator"
                    label="آسانسور"
                    checked={form.elevator}
                    onChange={(v) => set("elevator", v)}
                  />
                  <CheckRow
                    id="parking"
                    label="پارکینگ"
                    checked={form.parking}
                    onChange={(v) => set("parking", v)}
                  />
                  <CheckRow
                    id="storage"
                    label="انباری"
                    checked={form.storage}
                    onChange={(v) => set("storage", v)}
                  />
                </div>
                <Field label="امکانات بیشتر">
                  <div className="flex flex-wrap gap-2">
                    {amenityOptions.map((a) => {
                      const on = form.amenities.includes(a);
                      return (
                        <button
                          key={a}
                          type="button"
                          onClick={() =>
                            set(
                              "amenities",
                              on
                                ? form.amenities.filter((x) => x !== a)
                                : [...form.amenities, a],
                            )
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                            on
                              ? "border-primary bg-primary-soft text-primary"
                              : "border-border bg-background text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="توضیحات">
                  <Textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="وضعیت واحد، نورگیری، شرایط ساختمان و نکات مهم برای مستأجر…"
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckRow
                    id="booking"
                    label="نوبت‌دهی بازدید فعال باشد"
                    checked={form.bookingEnabled}
                    onChange={(v) => set("bookingEnabled", v)}
                  />
                  <CheckRow
                    id="tour"
                    label="امکان بازدید آنلاین"
                    checked={form.onlineTour}
                    onChange={(v) => set("onlineTour", v)}
                  />
                </div>
                {form.bookingEnabled ? (
                  <Field label="تقویم هوشمند بازدید">
                    <p className="mb-3 text-xs text-muted-foreground">
                      روزها و ساعت‌های آزاد بازدید را مشخص کنید؛ همین زمان‌ها در
                      صفحه آگهی به مستأجران نمایش داده می‌شود و قابل رزرو است.
                    </p>
                    <AvailabilityEditor
                      value={form.availability}
                      onChange={(next) => set("availability", next)}
                    />
                  </Field>
                ) : null}
              </>

            ) : null}

            {step === 2 ? (
              <>
                <Field label="نوع معامله">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: "rent", l: "رهن و اجاره" },
                      { v: "mortgage", l: "رهن کامل" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() =>
                          set("dealType", o.v as FormState["dealType"])
                        }
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          form.dealType === o.v
                            ? "border-primary bg-primary-soft text-primary"
                            : "border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="ودیعه (تومان)">
                  <Input
                    inputMode="numeric"
                    value={form.deposit}
                    onChange={(e) => set("deposit", digits(e.target.value))}
                  />
                  {form.deposit ? (
                    <p className="text-xs text-muted-foreground">
                      {formatCompactTomans(Number(form.deposit))}
                    </p>
                  ) : null}
                </Field>
                {form.dealType === "rent" ? (
                  <Field label="اجاره ماهانه (تومان)">
                    <Input
                      inputMode="numeric"
                      value={form.rent}
                      onChange={(e) => set("rent", digits(e.target.value))}
                    />
                    {form.rent ? (
                      <p className="text-xs text-muted-foreground">
                        {formatCompactTomans(Number(form.rent))}
                      </p>
                    ) : null}
                  </Field>
                ) : null}
                <CheckRow
                  id="negotiable"
                  label="امکان مذاکره روی ودیعه و اجاره وجود دارد"
                  checked={form.negotiable}
                  onChange={(v) => set("negotiable", v)}
                />
                <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-xs leading-6 text-muted-foreground">
                  <Wallet className="mt-0.5 size-4 shrink-0" aria-hidden />
                  پس از تأیید آگهی می‌توانید با طرح‌های ارتقا (نردبان، ویژه،
                  فوری) دیده‌شدن آن را افزایش دهید؛ هزینه از کیف پول کسر می‌شود.
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="rounded-xl border border-primary/25 bg-primary-soft/50 p-4 text-xs leading-6 text-foreground">
                  مدارک شما فقط برای احراز مالکیت استفاده می‌شود و برای کاربران
                  دیگر نمایش داده نمی‌شود.
                </div>
                <Field label="کد ملی مالک">
                  <Input
                    inputMode="numeric"
                    maxLength={10}
                    value={form.nationalId}
                    onChange={(e) => set("nationalId", digits(e.target.value))}
                    placeholder="۱۰ رقم"
                  />
                </Field>
                <UploadRow
                  label="سند مالکیت (تک‌برگ یا دفترچه‌ای)"
                  done={form.ownerDoc}
                  onUpload={() => set("ownerDoc", !form.ownerDoc)}
                />
                <UploadRow
                  label="کارت ملی یا شناسنامه مالک"
                  done={form.idDoc}
                  onUpload={() => set("idDoc", !form.idDoc)}
                />
              </>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">
                  پیش‌نمایش آگهی
                </h2>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <div className="text-base font-semibold text-foreground">
                    {form.title || "بدون عنوان"}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {form.city} — {form.neighborhood}
                    {form.approxLocation ? ` (${form.approxLocation})` : ""}
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <Preview label="متراژ" value={`${toFaDigits(form.area || "۰")} متر`} />
                    <Preview label="خواب" value={toFaDigits(form.rooms || "۰")} />
                    <Preview
                      label="طبقه"
                      value={`${toFaDigits(form.floor || "۰")} از ${toFaDigits(form.totalFloors || "۰")}`}
                    />
                    <Preview
                      label="سال ساخت"
                      value={toFaDigits(form.yearBuilt || "—")}
                    />
                    <Preview
                      label="ودیعه"
                      value={
                        form.deposit ? formatCompactTomans(Number(form.deposit)) : "—"
                      }
                    />
                    <Preview
                      label="اجاره ماهانه"
                      value={
                        form.dealType === "mortgage"
                          ? "رهن کامل"
                          : form.rent
                            ? formatCompactTomans(Number(form.rent))
                            : "—"
                      }
                    />
                    <Preview
                      label="مذاکره"
                      value={form.negotiable ? "امکان‌پذیر" : "ثابت"}
                    />
                    <Preview
                      label="بازدید آنلاین"
                      value={form.onlineTour ? "دارد" : "ندارد"}
                    />
                  </dl>
                  {form.amenities.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {form.amenities.map((a) => (
                        <span
                          key={a}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {form.description ? (
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {form.description}
                    </p>
                  ) : null}
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs leading-6 text-muted-foreground">
                  با ارسال آگهی، صحت اطلاعات و مالکیت ملک را تأیید می‌کنید. آگهی
                  پس از بازبینی کارشناس منتشر می‌شود.
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => {
              setErrors([]);
              setStep((s) => Math.max(0, s - 1));
            }}
          >
            <ChevronRight className="size-4" aria-hidden />
            مرحله قبل
          </Button>

          {step < stepTitles.length - 1 ? (
            <Button onClick={next}>
              مرحله بعد
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              ارسال برای بازبینی
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function digits(v: string) {
  return v.replace(/[^\d]/g, "");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function CheckRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
      </label>
    </div>
  );
}

function UploadRow({
  label,
  done,
  onUpload,
}: {
  label: string;
  done: boolean;
  onUpload: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-sm text-foreground">
        <FileText className="size-4 text-muted-foreground" aria-hidden />
        {label}
      </div>
      <Button
        type="button"
        size="sm"
        variant={done ? "outline" : "default"}
        onClick={onUpload}
      >
        {done ? "بارگذاری شد ✓" : "بارگذاری فایل"}
      </Button>
    </div>
  );
}

function Preview({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

const introSteps = [
  {
    icon: Home,
    title: "اطلاعات ملک",
    body: "آدرس تقریبی، متراژ، تعداد اتاق، امکانات و شرایط مالی را ثبت می‌کنید.",
  },
  {
    icon: ShieldCheck,
    title: "احراز مالکیت",
    body: "با ارسال سند و مدارک هویتی، مالکیت شما تأیید می‌شود.",
  },
  {
    icon: FileText,
    title: "بازبینی و انتشار",
    body: "تیم املاک فایل را بررسی کرده و در صورت تأیید منتشر می‌کند.",
  },
];

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="app-container py-10 md:py-14">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            برای موجران
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground md:text-4xl">
            ملک خود را با اطمینان منتشر کنید
          </h1>
          <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
            به‌جای انبوه تماس‌های نامرتبط، فقط با مستأجران احراز‌شده مذاکره کنید؛
            پیشنهادها را در پلتفرم دریافت و مسیر معامله را شفاف پیش ببرید.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={onStart}>
              شروع ثبت ملک
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/guide">راهنمای معامله امن</Link>
            </Button>
          </div>

          <ul className="mt-8 space-y-3">
            {[
              "دسترسی فقط مستأجران تأییدشده",
              "پیشنهادهای ساختاریافته و قابل مقایسه",
              "پرداخت دومرحله‌ای امن با نگهداری وجه",
              "قرارداد خودنویس و تسویه یکپارچه",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="border-border bg-surface shadow-elevated">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              مراحل ثبت ملک
            </h2>
            <ol className="space-y-4">
              {introSteps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                    <s.icon className="size-4" aria-hidden />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {toFaDigits(i + 1)}. {s.title}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <Button className="w-full" onClick={onStart}>
              تکمیل فرم ثبت ملک
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function AuthGate() {
  return (
    <div className="app-container py-14">
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-4 p-8 text-center">
          <ShieldCheck className="mx-auto size-12 text-primary" aria-hidden />
          <h1 className="text-xl font-bold text-foreground">
            برای ثبت آگهی وارد حساب کاربری شوید
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            ثبت آگهی فقط برای کاربران دارای حساب موجر امکان‌پذیر است.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/auth" search={{ mode: "login" }}>
                ورود
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth" search={{ mode: "signup" }}>
                ثبت‌نام موجر
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VerifyGate() {
  return (
    <div className="app-container py-14">
      <Card className="mx-auto max-w-xl border-warning/30 bg-warning-soft/40">
        <CardContent className="space-y-4 p-8 text-center">
          <ShieldCheck className="mx-auto size-12 text-warning" aria-hidden />
          <h1 className="text-xl font-bold text-foreground">
            ابتدا هویت خود را احراز کنید
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            برای ثبت آگهی ملک، باید در بخش پروفایل کد ملی خود را وارد و هویتتان را
            تأیید کنید.
          </p>
          <Button asChild>
            <Link to="/landlord/profile">رفتن به پروفایل و ثبت کد ملی</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
