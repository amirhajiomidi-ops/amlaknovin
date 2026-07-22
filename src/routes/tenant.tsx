import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  CalendarClock,
  FileSignature,
  Handshake,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

import { tenantProfile } from "@/data/tenant";
import { toFaDigits } from "@/lib/format";

export const Route = createFileRoute("/tenant")({
  head: () => ({
    meta: [
      { title: "پنل مستأجر — املاک" },
      {
        name: "description",
        content:
          "پروفایل مالی، رزرو بازدید، پیشنهادها و قراردادهای شما در یک نگاه.",
      },
      { property: "og:title", content: "پنل مستأجر — املاک" },
      {
        property: "og:description",
        content: "مدیریت جست‌وجو، بازدید، پیشنهاد و قرارداد در یک پنل امن.",
      },
    ],
  }),
  component: TenantLayout,
});

const navItems: ReadonlyArray<{
  to: "/tenant" | "/tenant/profile" | "/tenant/bookings" | "/tenant/offers" | "/tenant/contracts";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/tenant", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/tenant/profile", label: "پروفایل مالی", icon: UserRound },
  { to: "/tenant/bookings", label: "بازدیدها", icon: CalendarClock },
  { to: "/tenant/offers", label: "پیشنهادها", icon: Handshake },
  { to: "/tenant/contracts", label: "قراردادها", icon: FileSignature },
];

function TenantLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="app-container py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">خوش آمدید</p>
          <h1 className="text-2xl font-bold text-foreground">
            {tenantProfile.fullName}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            امتیاز اعتباری: {toFaDigits(tenantProfile.creditScore)} از {toFaDigits(1000)}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-success" aria-hidden />
          حساب فعال و در وضعیت امن
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
