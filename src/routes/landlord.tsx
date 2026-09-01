import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import {
  Building2,
  CalendarClock,
  CalendarRange,
  FileSignature,
  Handshake,
  LayoutDashboard,
  UserRound,
  Wallet,
} from "lucide-react";

import { useAppState } from "@/context/app-state";
import { landlordProfile } from "@/data/landlord";
import { formatTomans, toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/landlord")({
  head: () => ({
    meta: [
      { title: "پنل موجر — املاک" },
      {
        name: "description",
        content:
          "مدیریت آگهی‌ها، درخواست بازدید، پیشنهادها، قراردادها و کیف پول برای موجران املاک.",
      },
      { property: "og:title", content: "پنل موجر — املاک" },
      {
        property: "og:description",
        content: "آگهی‌ها، بازدیدها، مذاکره‌ها و قراردادهای شما در یک پنل.",
      },
    ],
  }),
  component: LandlordLayout,
});

const navItems: ReadonlyArray<{
  to:
    | "/landlord"
    | "/landlord/properties"
    | "/landlord/bookings"
    | "/landlord/availability"
    | "/landlord/offers"
    | "/landlord/contracts"
    | "/landlord/wallet"
    | "/landlord/profile";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/landlord", label: "نمای کلی", icon: LayoutDashboard, exact: true },
  { to: "/landlord/properties", label: "ملک‌های من", icon: Building2 },
  { to: "/landlord/bookings", label: "درخواست بازدید", icon: CalendarClock },
  { to: "/landlord/availability", label: "تقویم بازدید", icon: CalendarRange },
  { to: "/landlord/offers", label: "پیشنهادها", icon: Handshake },
  { to: "/landlord/contracts", label: "قراردادها", icon: FileSignature },
  { to: "/landlord/wallet", label: "کیف پول", icon: Wallet },
  { to: "/landlord/profile", label: "پروفایل و احراز هویت", icon: UserRound },
];

function LandlordLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { balance, user } = useAppState();

  return (
    <div className="app-container py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">پنل موجر</p>
          <h1 className="text-2xl font-bold text-foreground">
            {user?.role === "landlord" ? user.fullName : landlordProfile.fullName}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            نرخ پاسخ‌گویی: {toFaDigits(landlordProfile.responseRate)}٪
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary-soft px-3 py-2 text-xs font-semibold text-primary">
            <Wallet className="size-4" aria-hidden />
            موجودی: {formatTomans(balance)}
          </span>
          <span className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            مالکیت تأییدشده
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-border bg-surface p-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(item.to + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:bg-secondary"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
