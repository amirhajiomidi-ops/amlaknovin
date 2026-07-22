import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarClock,
  Download,
  FileSignature,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProperty } from "@/data/properties";
import {
  contractStatusLabels,
  contracts,
  type Contract,
  type ContractStatus,
} from "@/data/tenant";
import { formatCompactTomans, formatJalali } from "@/lib/format";

export const Route = createFileRoute("/tenant/contracts")({
  head: () => ({
    meta: [
      { title: "قراردادها و پرداخت امن — پنل مستأجر" },
      {
        name: "description",
        content: "امضای دیجیتال، پرداخت امن و پیگیری وضعیت قراردادهای اجاره.",
      },
      { property: "og:title", content: "قراردادها و پرداخت امن — پنل مستأجر" },
      {
        property: "og:description",
        content: "همه قراردادهای فعال و در انتظار امضای شما در یک صفحه.",
      },
    ],
  }),
  component: ContractsPage,
});

const tone: Record<ContractStatus, string> = {
  "awaiting-signature": "border-warning/30 bg-warning-soft text-warning",
  "landlord-signed": "border-primary/30 bg-primary/10 text-primary",
  signed: "border-success/30 bg-success-soft text-success",
  active: "border-success/30 bg-success-soft text-success",
  ended: "border-border bg-muted text-muted-foreground",
};

function ContractsPage() {
  const pending = contracts.filter(
    (c) => c.status === "awaiting-signature" || c.status === "landlord-signed",
  );
  const active = contracts.filter((c) => c.status === "active" || c.status === "signed");
  const ended = contracts.filter((c) => c.status === "ended");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">قراردادها</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          قراردادها با امضای الکترونیک معتبر و پرداخت امن پلتفرم رسمی می‌شوند.
        </p>
      </div>

      <Section title="در انتظار امضا / پرداخت" contracts={pending} highlight />
      <Section title="قراردادهای فعال" contracts={active} />
      <Section title="پایان‌یافته" contracts={ended} />

      {contracts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-background/50 p-10 text-center">
          <FileSignature className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            هنوز قراردادی ندارید. پس از پذیرش پیشنهاد، قرارداد در این بخش نمایان می‌شود.
          </p>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  contracts,
  highlight,
}: {
  title: string;
  contracts: Contract[];
  highlight?: boolean;
}) {
  if (contracts.length === 0) return null;
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {contracts.map((c) => (
        <ContractCard key={c.id} contract={c} highlight={highlight} />
      ))}
    </section>
  );
}

function ContractCard({
  contract,
  highlight,
}: {
  contract: Contract;
  highlight?: boolean;
}) {
  const p = getProperty(contract.propertyId);
  if (!p) return null;
  const canSign = contract.status === "awaiting-signature" || contract.status === "landlord-signed";

  return (
    <Card className={highlight ? "border-primary/30" : ""}>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <img
              src={p.images[0]}
              alt=""
              className="size-20 rounded-xl object-cover"
            />
            <div>
              <Link
                to="/property/$id"
                params={{ id: p.id }}
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                {p.title}
              </Link>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="size-3.5" aria-hidden />
                از {formatJalali(contract.startDate)} تا {formatJalali(contract.endDate)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                شماره قرارداد: {contract.id}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={tone[contract.status]}>
            {contractStatusLabels[contract.status]}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 sm:grid-cols-3">
          <FigureBox label="ودیعه" value={formatCompactTomans(contract.deposit)} />
          <FigureBox label="اجاره ماهانه" value={formatCompactTomans(contract.rent)} />
          <FigureBox
            label="مبلغ نگه‌داشت امانی"
            value={formatCompactTomans(contract.escrowAmount)}
            icon={Lock}
          />
        </div>

        {canSign && (
          <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    گام بعدی: پرداخت امن و امضای الکترونیک
                  </p>
                  <p className="mt-1 text-xs text-primary/80">
                    مبلغ پرداختی تا تحویل کلید در حساب امانی نگه‌داری می‌شود.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Download className="size-4" aria-hidden /> پیش‌نمایش قرارداد
                </Button>
                <Button size="sm">
                  پرداخت امن و امضا
                </Button>
              </div>
            </div>
          </div>
        )}

        {contract.status === "active" && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-background p-4">
            <div className="text-xs text-muted-foreground">
              پرداخت اجاره ماه جاری در سررسید بعدی: {formatJalali(contract.startDate)}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="size-4" aria-hidden /> دانلود قرارداد
              </Button>
              <Button size="sm">پرداخت اجاره</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FigureBox({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Lock;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {Icon && <Icon className="size-3.5" aria-hidden />}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
