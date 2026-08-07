import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { formatUSD, formatDate, formatTime } from "@/lib/currency";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Transaction History — BestCash Demo Banking" },
      {
        name: "description",
        content: "Search and filter the fictional transaction history of the BestCash banking prototype.",
      },
      { property: "og:title", content: "Transaction History — BestCash Demo Banking" },
      { property: "og:description", content: "Filter demo transactions by direction and keyword." },
    ],
  }),
  component: HistoryPage,
});

const filters = ["all", "in", "out"] as const;

function HistoryPage() {
  const { transactions } = useBank();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const list = useMemo(
    () =>
      transactions.filter((t) => {
        const matches = `${t.title} ${t.counterparty}`.toLowerCase().includes(query.toLowerCase());
        const dir = filter === "all" || (filter === "in" ? t.amount > 0 : t.amount < 0);
        return matches && dir;
      }),
    [transactions, query, filter],
  );

  return (
    <AppShell title="History">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm capitalize",
                  filter === f ? "border-primary text-primary" : "border-border text-muted-foreground",
                )}
              >
                {f === "in" ? "Money in" : f === "out" ? "Money out" : "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          {list.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">No transactions found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((t) => (
                <li key={t.id} className="flex items-center gap-3 p-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      t.amount > 0 ? "bg-[var(--success)]/15" : "bg-secondary",
                    )}
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
                      {formatDate(t.date)} · {formatTime(t.date)} · {t.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        t.amount > 0 && "text-[var(--success)]",
                      )}
                    >
                      {t.amount > 0 ? "+" : "−"}
                      {formatUSD(Math.abs(t.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
