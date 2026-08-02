import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, LayoutGrid, Map, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard } from "@/components/property/property-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { useAppState } from "@/context/app-state";
import { pinLimitedFeatured, rankWithPromotions } from "@/lib/ranking";
import {
  cities,
  currentTenantFit,
  neighborhoodsByCity,
  properties,
  type DealType,
} from "@/data/properties";
import { formatCompactTomans, toFaDigits } from "@/lib/format";


export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "جست‌وجوی خانه — املاک" },
      {
        name: "description",
        content:
          "فایل‌های تأییدشده رهن و اجاره در تهران و کرج را با فیلترهای دقیق پیدا کنید.",
      },
    ],
  }),
  component: SearchPage,
});

type SortKey = "newest" | "rent-asc" | "deposit-asc" | "match";

function SearchPage() {
  const [city, setCity] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [deal, setDeal] = useState<DealType | "">("");
  const [depositMax, setDepositMax] = useState<number>(5_000_000_000);
  const [rentMax, setRentMax] = useState<number>(40_000_000);
  const [rooms, setRooms] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [onlineTour, setOnlineTour] = useState<boolean>(false);
  const [bookable, setBookable] = useState<boolean>(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"list" | "map">("list");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const available = properties.filter(
    (p) => p.status !== "inactive" && p.status !== "needs-fix",
  );

  const filtered = useMemo(() => {
    return available
      .filter((p) => (city ? p.city === city : true))
      .filter((p) => (neighborhood ? p.neighborhood === neighborhood : true))
      .filter((p) => (deal ? p.dealType === deal : true))
      .filter((p) => p.deposit <= depositMax)
      .filter((p) => (p.dealType === "mortgage" ? true : p.rent <= rentMax))
      .filter((p) => (rooms ? p.rooms === Number(rooms) : true))
      .filter((p) => (verifiedOnly ? p.fileVerified && p.ownerVerified : true))
      .filter((p) => (onlineTour ? p.onlineTour : true))
      .filter((p) => (bookable ? p.bookingEnabled : true));
  }, [
    available,
    city,
    neighborhood,
    deal,
    depositMax,
    rentMax,
    rooms,
    verifiedOnly,
    onlineTour,
    bookable,
  ]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sort) {
      case "rent-asc":
        return copy.sort((a, b) => a.rent - b.rent);
      case "deposit-asc":
        return copy.sort((a, b) => a.deposit - b.deposit);
      case "match": {
        const rank: Record<string, number> = {
          match: 0,
          review: 1,
          unknown: 2,
          mismatch: 3,
        };
        return copy.sort(
          (a, b) =>
            rank[currentTenantFit[a.id] ?? "unknown"] -
            rank[currentTenantFit[b.id] ?? "unknown"],
        );
      }
      default:
        return copy.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
    }
  }, [filtered, sort]);

  // اثر طرح‌های ارتقا روی ترتیب نتایج
  const { promotions } = useAppState();
  const { featuredList, mainList, pinnedNote } = useMemo(() => {
    if (sort === "newest") {
      const { featured, rest } = rankWithPromotions(sorted, promotions);
      return { featuredList: featured, mainList: rest, pinnedNote: false };
    }
    const { pinned, rest } = pinLimitedFeatured(sorted, promotions, 2);
    return { featuredList: pinned, mainList: rest, pinnedNote: pinned.length > 0 };
  }, [sorted, promotions, sort]);


  const activeFilters: Array<{ key: string; label: string; clear: () => void }> = [];
  if (city)
    activeFilters.push({
      key: "city",
      label: `شهر: ${city}`,
      clear: () => {
        setCity("");
        setNeighborhood("");
      },
    });
  if (neighborhood)
    activeFilters.push({
      key: "n",
      label: `محله: ${neighborhood}`,
      clear: () => setNeighborhood(""),
    });
  if (deal)
    activeFilters.push({
      key: "d",
      label: deal === "mortgage" ? "رهن کامل" : "رهن و اجاره",
      clear: () => setDeal(""),
    });
  if (rooms)
    activeFilters.push({
      key: "r",
      label: `${toFaDigits(rooms)} خواب`,
      clear: () => setRooms(""),
    });
  if (verifiedOnly)
    activeFilters.push({
      key: "v",
      label: "فقط تأییدشده",
      clear: () => setVerifiedOnly(false),
    });
  if (onlineTour)
    activeFilters.push({
      key: "o",
      label: "بازدید آنلاین",
      clear: () => setOnlineTour(false),
    });
  if (bookable)
    activeFilters.push({
      key: "b",
      label: "نوبت‌دهی فعال",
      clear: () => setBookable(false),
    });

  const resetAll = () => {
    setCity("");
    setNeighborhood("");
    setDeal("");
    setDepositMax(5_000_000_000);
    setRentMax(40_000_000);
    setRooms("");
    setVerifiedOnly(false);
    setOnlineTour(false);
    setBookable(false);
  };

  const filterPanel = (
    <div className="space-y-6">
      <FilterGroup label="شهر">
        <Select
          value={city || "all"}
          onValueChange={(v) => {
            setCity(v === "all" ? "" : v);
            setNeighborhood("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="همه" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterGroup>

      {city ? (
        <FilterGroup label="محله">
          <Select
            value={neighborhood || "all"}
            onValueChange={(v) => setNeighborhood(v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="همه محله‌ها" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه محله‌ها</SelectItem>
              {neighborhoodsByCity[city]?.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterGroup>
      ) : null}

      <FilterGroup label="نوع معامله">
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "", l: "همه" },
            { v: "rent", l: "رهن و اجاره" },
            { v: "mortgage", l: "رهن کامل" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setDeal(o.v as DealType | "")}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                deal === o.v
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup
        label={`حداکثر ودیعه: ${formatCompactTomans(depositMax)}`}
      >
        <Slider
          value={[depositMax]}
          onValueChange={(v) => setDepositMax(v[0])}
          min={100_000_000}
          max={8_000_000_000}
          step={100_000_000}
          dir="rtl"
        />
      </FilterGroup>

      {deal !== "mortgage" ? (
        <FilterGroup
          label={`حداکثر اجاره ماهانه: ${formatCompactTomans(rentMax)}`}
        >
          <Slider
            value={[rentMax]}
            onValueChange={(v) => setRentMax(v[0])}
            min={2_000_000}
            max={60_000_000}
            step={1_000_000}
            dir="rtl"
          />
        </FilterGroup>
      ) : null}

      <FilterGroup label="تعداد اتاق">
        <div className="grid grid-cols-5 gap-2">
          {["", "1", "2", "3", "4"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRooms(r)}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                rooms === r
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {r ? toFaDigits(r) : "همه"}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="ویژگی‌ها">
        <div className="space-y-2.5">
          <CheckboxRow
            id="verified"
            checked={verifiedOnly}
            onChange={setVerifiedOnly}
            label="فقط فایل و مالک تأییدشده"
          />
          <CheckboxRow
            id="tour"
            checked={onlineTour}
            onChange={setOnlineTour}
            label="امکان بازدید آنلاین"
          />
          <CheckboxRow
            id="book"
            checked={bookable}
            onChange={setBookable}
            label="نوبت‌دهی فعال"
          />
        </div>
      </FilterGroup>

      <Button variant="outline" className="w-full" onClick={resetAll}>
        بازنشانی همه فیلترها
      </Button>
    </div>
  );

  return (
    <div className="app-container py-6 md:py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            جست‌وجوی خانه
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {toFaDigits(sorted.length)} فایل تأییدشده در نتایج
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-xl border border-border bg-surface p-0.5 md:flex">
            <ToggleBtn active={view === "list"} onClick={() => setView("list")}>
              <LayoutGrid className="size-4" aria-hidden />
              فهرست
            </ToggleBtn>
            <ToggleBtn active={view === "map"} onClick={() => setView("map")}>
              <Map className="size-4" aria-hidden />
              نقشه
            </ToggleBtn>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="size-4" aria-hidden />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="rent-asc">کمترین اجاره</SelectItem>
              <SelectItem value="deposit-asc">کمترین ودیعه</SelectItem>
              <SelectItem value="match">بیشترین تطابق</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            <Filter className="size-4" aria-hidden />
            فیلترها
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={f.clear}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground hover:bg-muted"
            >
              {f.label}
              <X className="size-3" aria-hidden />
            </button>
          ))}
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            حذف همه
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h2 className="mb-4 text-sm font-semibold text-foreground">فیلترها</h2>
              {filterPanel}
            </div>
            <AdSlot placement="search-sidebar" size="sidebar" />
          </div>
        </aside>

        <section className="space-y-6">
          {view === "map" ? (
            <div className="grid gap-4">
              <MapPlaceholder count={sorted.length} />
              <div className="grid gap-4 sm:grid-cols-2">
                {sorted.slice(0, 4).map((p) => (
                  <PropertyCard
                    key={p.id}
                    property={p}
                    fit={currentTenantFit[p.id]}
                  />
                ))}
              </div>
            </div>
          ) : sorted.length > 0 ? (
            <>
              {featuredList.length > 0 ? (
                <section className="rounded-2xl border border-primary/25 bg-primary-soft/40 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Crown className="size-4 text-primary" aria-hidden />
                    <h2 className="text-sm font-semibold text-foreground">
                      آگهی‌های ویژه
                    </h2>
                    <span className="text-[11px] text-muted-foreground">
                      {pinnedNote
                        ? "این آگهی‌ها با طرح «ویژه» در بالای نتایج نمایش داده می‌شوند."
                        : "سنجاق‌شده با طرح ارتقای «ویژه»"}
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {featuredList.map((p) => (
                      <PropertyCard
                        key={p.id}
                        property={p}
                        fit={currentTenantFit[p.id]}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {mainList.map((p, i) => (
                  <Fragment key={p.id}>
                    <PropertyCard property={p} fit={currentTenantFit[p.id]} />
                    {(i + 1) % 6 === 0 && i + 1 < mainList.length ? (
                      <AdSlot
                        placement="search-inline"
                        size="inline"
                        index={Math.floor(i / 6)}
                      />
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </>
          ) : (
            <EmptyState onReset={resetAll} />
          )}
        </section>

      </div>

      {/* Mobile filter drawer */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div
            className="absolute inset-y-0 end-0 flex w-[85%] max-w-sm flex-col bg-surface shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">فیلترها</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="بستن"
                className="grid size-8 place-items-center rounded-lg hover:bg-muted"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{filterPanel}</div>
            <div className="sticky-action-bar">
              <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                نمایش {toFaDigits(sorted.length)} فایل
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function CheckboxRow({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
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

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function MapPlaceholder({ count }: { count: number }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-soft via-surface to-accent-soft">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(30,77,143,0.08) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(30,77,143,0.08) 0 1px, transparent 1px 32px)",
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-xl border border-border bg-surface/90 px-4 py-3 text-center backdrop-blur">
          <Map className="mx-auto mb-2 size-5 text-primary" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            نمایش نقشه — پیش‌نمایش پروتوتایپ
          </p>
          <p className="text-xs text-muted-foreground">
            {toFaDigits(count)} فایل روی نقشه
          </p>
        </div>
      </div>
      {/* mock pins */}
      {[
        [22, 34],
        [45, 55],
        [65, 40],
        [78, 65],
        [30, 70],
      ].map(([x, y], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/20"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
      <div className="max-w-sm space-y-3 px-6">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
          <Filter className="size-6" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          فایلی با این فیلترها پیدا نشد
        </h3>
        <p className="text-sm text-muted-foreground">
          بازه ودیعه یا اجاره را کمی گسترش دهید، یا محله را تغییر دهید.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Button variant="outline" onClick={onReset}>
            بازنشانی فیلترها
          </Button>
          <Button asChild>
            <Link to="/">بازگشت به خانه</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
