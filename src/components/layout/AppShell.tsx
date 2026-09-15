import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  Bitcoin,
  User,
  Bell,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";
import { useBank } from "@/lib/bank-store";
import { useAuth } from "@/lib/auth-store";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/history", label: "History", icon: Receipt },
  { to: "/crypto", label: "Crypto", icon: Bitcoin },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/support", label: "Support", icon: LifeBuoy },
] as const;

const mobileNav = [nav[0], nav[1], nav[4], nav[5], nav[6]] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile } = useBank();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
          <div className="px-2">
            <BrandLogo size={40} />
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {nav.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "gold-surface shadow-[var(--shadow-gold)]"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent p-3 text-xs leading-relaxed text-sidebar-foreground/70">
            BestCash account services, cards and transfers
          </div>
          <button
            onClick={logout}
            className="mt-3 flex items-center gap-2 px-2 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur lg:px-10">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <BrandLogo size={30} withText={false} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  BestCash / private banking
                </p>
                <h1 className="font-display text-lg font-semibold">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile" className="hidden items-center gap-2 sm:flex">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-semibold text-primary">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    profile.fullName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                  )}
                </span>
                <span className="max-w-40 truncate text-xs font-semibold">{profile.fullName}</span>
              </Link>
              <Link
                to="/notifications"
                className="relative rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground sm:px-3"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-10 lg:py-9">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {mobileNav.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}