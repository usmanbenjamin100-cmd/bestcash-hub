import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  ArrowLeftRight,
  Bitcoin,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { formatUSD, formatDate } from "@/lib/currency";
import { profile, savingsGoals, spendingByCategory } from "@/data/bank";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BestCash — Demo Online Banking Dashboard" },
      {
        name: "description",
        content:
          "BestCash is a fictional online banking prototype: balances, transfers, cards, history and crypto in one modern demo dashboard.",
      },
      { property: "og:title", content: "BestCash — Demo Online Banking Dashboard" },
      {
        property: "og:description",
        content: "A modern demo banking prototype with dashboard, transfers, cards and crypto.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { to: "/transfers", label: "Transfer", icon: ArrowLeftRight },
  { to: "/cards", label: "Cards", icon: Plus },
  { to: "/crypto", label: "Crypto", icon: Bitcoin },
  { to: "/history", label: "History", icon: Receipt },
] as const;

function Dashboard() {
  const { totalBalance, accounts, transactions } = useBank();
  const [hidden, setHidden] = useState(false);
  const maxSpend = Math.max(...spendingByCategory.map((s) => s.value));

  const inflow = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outflow = transactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-5">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 elev">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-2xl"
              style={{ background: "var(--gradient-gold)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total balance · {profile.currency}</p>
                <button
                  onClick={() => setHidden((v) => !v)}
                  className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-foreground"
                  aria-label={hidden ? "Show balance" : "Hide balance"}
                >
                  {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {hidden ? "••••••" : formatUSD(totalBalance)}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--success)]">
                <TrendingUp className="h-4 w-4" /> +3.2% this month
              </p>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {quickActions.map((a) => (
                  <Link
                    key={a.label}
                    to={a.to}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-secondary/60 px-2 py-3 text-xs font-medium transition-colors hover:border-primary/60"
                  >
                    <a.icon className="h-4.5 w-4.5 text-primary" />
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {accounts.map((a) => (
              <div key={a.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{a.type}</p>
                <p className="mt-1 text-sm font-medium">{a.name}</p>
                <p className="mt-2 font-display text-xl font-semibold">{formatUSD(a.balance)}</p>
                <p className="mt-1 text-xs text-muted-foreground">•••• {a.number.slice(-4)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent activity</h2>
              <Link to="/history" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {transactions.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      t.amount > 0 ? "bg-[var(--success)]/15" : "bg-secondary"
                    }`}
                  >
                    {t.amount > 0 ? (
                      <ArrowDownLeft className="h-4 w-4 text-[var(--success)]" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(t.date)} · {t.status}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      t.amount > 0 ? "text-[var(--success)]" : "text-foreground"
                    }`}
                  >
                    {t.amount > 0 ? "+" : "−"}
                    {formatUSD(Math.abs(t.amount))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Cash flow</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Money in</span>
                <span className="font-semibold text-[var(--success)]">{formatUSD(inflow)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Money out</span>
                <span className="font-semibold">{formatUSD(outflow)}</span>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {spendingByCategory.map((s) => (
                <div key={s.category}>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{s.category}</span>
                    <span>{formatUSD(s.value)}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(s.value / maxSpend) * 100}%`,
                        background: "var(--gradient-gold)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Savings goals</h2>
            <div className="mt-4 space-y-4">
              {savingsGoals.map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{g.name}</span>
                    <span className="text-muted-foreground">
                      {Math.round((g.saved / g.target) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(g.saved / g.target) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatUSD(g.saved)} of {formatUSD(g.target)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
