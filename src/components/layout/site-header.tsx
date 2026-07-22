import { Link } from "@tanstack/react-router";
import { Menu, Search, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "آگهی‌ها", to: "/search" },
  { label: "پنل من", to: "/tenant" },
  { label: "راهنمای معامله امن", to: "/guide" },
  { label: "ثبت ملک", to: "/list-property" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="app-container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold"
          >
            ا
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            املاک
          </span>
        </Link>

        <div className="hidden flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">جست‌وجوی سریع</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="جست‌وجو در محله، متراژ، ودیعه…"
              className="w-full rounded-xl border border-border bg-background py-2 pe-9 ps-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </label>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            ورود
          </Button>
          <Button variant="default" size="sm">
            ثبت‌نام
          </Button>
        </div>

        <button
          type="button"
          aria-label="حساب کاربری"
          className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground md:hidden"
        >
          <UserRound className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="منو"
          className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>
    </header>
  );
}
