import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bitcoin,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  Receipt,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { formatUSD, formatDate } from "@/lib/currency";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BestCash — Online Banking Dashboard" },
      {
        name: "description",
        content: "Review your BestCash balance, cash flow, savings goals, portfolio and recent activity.",
      },
      { property: "og:title", content: "BestCash — Online Banking Dashboard" },
      {
        property: "og:description",
        content: "A clear view of your money, goals and recent activity.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { to: "/transfers", label: "Send money", icon: ArrowLeftRight },
  { to: "/cards", label: "Manage cards", icon: CreditCard },
  { to: "/crypto", label: "Explore assets", icon: Bitcoin },
  { to: "/history", label: "View history", icon: Receipt },
] as const;

function Dashboard() {
  const {
    totalBalance,
    accounts,
    transactions,
    profile,
    savingsGoals,
    spendingByCategory,
  } = useBank();
  const [hidden, setHidden] = useState(false);
  const investments = accounts.filter((account) => account.type === "Investment");
  const inflow = transactions.filter((transaction) => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0);
  const outflow = transactions.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const flowMaximum = Math.max(inflow, outflow, 1);
  const categoryMaximum = Math.max(...spendingByCategory.map((item) => item.value), 1);
  const firstName = profile.fullName.trim().split(/\s+/)[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <AppShell title="Overview">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{today}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{greeting}, {firstName}.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your financial picture, kept clear and simple.</p>
          </div>
          <Link to="/transfers" className="inline-flex items-center justify-center gap-2 rounded-xl gold-surface px-4 py-3 text-sm font-semibold no-underline shadow-sm transition-transform hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Send money
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-5">
            <section className="relative overflow-hidden rounded-3xl border border-[oklch(0.34_0.06_65)] bg-[oklch(0.28_0.045_65)] p-6 text-white shadow-[var(--shadow-soft)] sm:p-8">
              <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-7 -top-12 h-48 w-48 rounded-full border border-white/10" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-white/65">Total balance <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">{profile.currency.split(" — ")[0]}</span></p>
                  <button type="button" onClick={() => setHidden((value) => !value)} className="rounded-full border border-white/15 p-2 text-white/70 transition-colors hover:text-white" aria-label={hidden ? "Show balance" : "Hide balance"}>
                    {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <p className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{hidden ? "••••••" : formatUSD(totalBalance)}</p>
                  <p className="mb-1 text-xs text-white/55">across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}</p>
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {accounts.map((account) => (
                    <div key={account.id} className="rounded-xl border border-white/10 bg-white/[0.07] px-3.5 py-3">
                      <div className="flex items-center justify-between gap-2 text-[10px] text-white/60"><span>{account.name}</span><span>•• {account.number.slice(-4)}</span></div>
                      <p className="mt-1.5 text-sm font-semibold">{hidden ? "••••" : formatUSD(account.balance)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div><h3 className="text-sm font-bold">Cash flow</h3><p className="mt-1 text-xs text-muted-foreground">From the activity shown in your account</p></div>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><TrendingUp className="h-4 w-4" /></span>
                </div>
                <div className="mt-5 space-y-4">
                  {[{ label: "Money in", value: inflow, color: "bg-[var(--success)]" }, { label: "Money out", value: outflow, color: "bg-primary" }].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between gap-3 text-xs"><span className="text-muted-foreground">{item.label}</span><span className="font-semibold">{formatUSD(item.value)}</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: Math.max(item.value > 0 ? 5 : 0, (item.value / flowMaximum) * 100) + "%" }} /></div>
                    </div>
                  ))}
                </div>
                {spendingByCategory.length > 0 && <div className="mt-5 border-t border-border pt-4"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Spending categories</p><div className="space-y-3">{spendingByCategory.slice(0, 4).map((item) => <div key={item.category}><div className="flex justify-between text-[11px] text-muted-foreground"><span>{item.category}</span><span>{formatUSD(item.value)}</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary/80" style={{ width: Math.min(100, (item.value / categoryMaximum) * 100) + "%" }} /></div></div>)}</div></div>}
              </section>

              <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                <h3 className="text-sm font-bold">Quick actions</h3>
                <div className="mt-4 grid grid-cols-2 gap-2">{quickActions.map((action) => <Link key={action.label} to={action.to} className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background px-2 py-3 text-center text-[11px] font-semibold no-underline transition hover:-translate-y-0.5 hover:border-primary/50"><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><action.icon className="h-4 w-4" /></span>{action.label}</Link>)}</div>
              </section>
            </div>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-bold">Recent activity</h3><p className="mt-1 text-xs text-muted-foreground">Your latest account movements</p></div><Link to="/history" className="inline-flex items-center gap-1 text-xs font-semibold text-primary no-underline">See all <ChevronRight className="h-3.5 w-3.5" /></Link></div>
              {transactions.length > 0 ? <ul className="mt-3 divide-y divide-border">{transactions.slice(0, 5).map((transaction) => <li key={transaction.id} className="flex items-center gap-3 py-3"><span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", transaction.amount > 0 ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-secondary text-muted-foreground")}>{transaction.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{transaction.title}</span><span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{transaction.counterparty} · {formatDate(transaction.date)}</span></span><span className="shrink-0 text-right"><span className={cn("block text-sm font-semibold", transaction.amount > 0 && "text-[var(--success)]")}>{transaction.amount > 0 ? "+" : "−"}{formatUSD(Math.abs(transaction.amount))}</span><span className="mt-0.5 block text-[10px] capitalize text-muted-foreground">{transaction.status}</span></span></li>)}</ul> : <div className="mt-4 rounded-xl border border-dashed border-border bg-background px-5 py-8 text-center"><span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-secondary text-muted-foreground"><Receipt className="h-4 w-4" /></span><p className="mt-3 text-sm font-semibold">No account activity yet</p><p className="mt-1 text-xs text-muted-foreground">New deposits and transactions will appear here.</p></div>}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Savings goals</p><h3 className="mt-2 text-base font-semibold">Make progress, one step at a time</h3></div><span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><Sparkles className="h-4 w-4" /></span></div>
              {savingsGoals.length > 0 ? <div className="mt-5 space-y-5">{savingsGoals.map((goal) => { const progress = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0; return <div key={goal.id}><div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-semibold">{goal.name}</span><span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-primary">{Math.round(progress)}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: progress + "%" }} /></div><div className="mt-2 flex justify-between gap-2 text-[11px] text-muted-foreground"><span>{formatUSD(goal.saved)} saved</span><span>Target {formatUSD(goal.target)}</span></div></div>; })}</div> : <div className="mt-4 rounded-xl border border-dashed border-border bg-background p-4"><p className="text-sm font-medium">No savings goals yet</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Your goals will show here once they are added to your account.</p></div>}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Investments</p><h3 className="mt-2 text-base font-semibold">Portfolio overview</h3></div><TrendingUp className="h-5 w-5 text-primary" /></div>
              {investments.length > 0 ? <><div className="mt-5 rounded-xl bg-secondary/60 p-4"><p className="text-xs text-muted-foreground">Investment account value</p><p className="mt-1 font-display text-2xl font-semibold">{hidden ? "••••••" : formatUSD(investments.reduce((sum, account) => sum + account.balance, 0))}</p><p className="mt-1 text-[11px] text-muted-foreground">Across {investments.length} {investments.length === 1 ? "account" : "accounts"}</p></div><div className="mt-3 space-y-2">{investments.map((account) => <div key={account.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5"><span className="min-w-0"><span className="block truncate text-xs font-semibold">{account.name}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">•• {account.number.slice(-4)}</span></span><span className="shrink-0 text-xs font-semibold">{hidden ? "••••" : formatUSD(account.balance)}</span></div>)}</div></> : <div className="mt-4 rounded-xl border border-dashed border-border bg-background p-4"><p className="text-sm font-medium">No investment account linked</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">When your account includes investments, the portfolio value will appear here.</p><Link to="/crypto" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary no-underline">Explore digital assets <ChevronRight className="h-3.5 w-3.5" /></Link></div>}
            </section>

            <section className="rounded-2xl border border-primary/20 bg-secondary/50 p-5"><div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-[0.15em]">A little clarity</span></div><p className="mt-3 font-display text-lg font-semibold leading-snug">Small, steady choices can build lasting progress.</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Review your activity and goals to keep your plan up to date.</p></section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
