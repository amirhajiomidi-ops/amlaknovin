import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, Home, LogOut, Menu, Search, UserRound, Wallet } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnableRoleDialog } from "@/components/account/enable-role-dialog";
import { useAppState } from "@/context/app-state";
import { formatCompactTomans } from "@/lib/format";

const baseNav = [
  { label: "آگهی‌ها", to: "/search" as const },
  { label: "راهنمای معامله امن", to: "/guide" as const },
  { label: "ثبت ملک", to: "/list-property" as const },
];

export function SiteHeader() {
  const { user, signOut, balance, switchRole } = useAppState();
  const navigate = useNavigate();
  const [enableOpen, setEnableOpen] = useState(false);

  const panelTo = user?.activeRole === "landlord" ? "/landlord" : "/tenant";
  const otherRole = user?.activeRole === "landlord" ? "tenant" : "landlord";
  const otherRoleLabel = otherRole === "landlord" ? "موجر" : "مستأجر";
  const hasOtherRole = Boolean(user?.roles.includes(otherRole));
  const navItems = user
    ? [{ label: "پنل من", to: panelTo as "/tenant" | "/landlord" }, ...baseNav]
    : baseNav;

  return (
    <>
    {user ? (
      <EnableRoleDialog
        role={otherRole}
        open={enableOpen}
        onOpenChange={setEnableOpen}
        onEnabled={() =>
          navigate({ to: otherRole === "landlord" ? "/landlord" : "/tenant" })
        }
      />
    ) : null}
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="app-container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary"
          >
            <Home className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            هوم نوین
          </span>
        </Link>

        <div className="hidden flex-1 md:flex md:items-center">
          <span className="text-sm font-medium text-muted-foreground">
            با خیال راحت معامله کن
          </span>
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

        {user ? (
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">
              <Wallet className="size-4 text-primary" aria-hidden />
              {formatCompactTomans(balance)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserRound className="size-4" aria-hidden />
                  {user.fullName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {user.activeRole === "landlord"
                    ? "حالت فعلی: موجر"
                    : "حالت فعلی: مستأجر"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={panelTo}>پنل کاربری</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={
                      user.activeRole === "landlord"
                        ? "/landlord/wallet"
                        : "/tenant/wallet"
                    }
                  >
                    کیف پول
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (hasOtherRole) {
                      switchRole(otherRole);
                      navigate({
                        to: otherRole === "landlord" ? "/landlord" : "/tenant",
                      });
                    } else {
                      setEnableOpen(true);
                    }
                  }}
                >
                  <ArrowLeftRight className="size-4" aria-hidden />
                  {hasOtherRole
                    ? `تغییر به حالت ${otherRoleLabel}`
                    : `فعال‌سازی حساب ${otherRoleLabel}`}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                    navigate({ to: "/", replace: true });
                  }}
                >
                  <LogOut className="size-4" aria-hidden />
                  خروج از حساب
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth" search={{ mode: "login" }}>
                ورود
              </Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link to="/auth" search={{ mode: "signup" }}>
                ثبت‌نام
              </Link>
            </Button>
          </div>
        )}

        <Link
          to={user ? panelTo : "/auth"}
          aria-label="حساب کاربری"
          className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground md:hidden"
        >
          <UserRound className="size-5" aria-hidden />
        </Link>
        <button
          type="button"
          aria-label="منو"
          className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>
    </header>
    </>
  );
}
