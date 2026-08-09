import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Snowflake, Lock, Globe, ShoppingBag, CheckCircle2, Copy } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { VirtualCard } from "@/components/cards/VirtualCard";
import { useBank } from "@/lib/bank-store";
import { formatUSD } from "@/lib/currency";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Cards & ATM — BestCash Banking" },
      {
        name: "description",
        content:
          "Manage BestCash cards, freeze spending, set limits and control online and ATM usage.",
      },
      { property: "og:title", content: "Cards & ATM — BestCash Banking" },
      {
        property: "og:description",
        content: "Freeze cards, set limits and manage ATM controls.",
      },
    ],
  }),
  component: CardsPage,
});

function CardsPage() {
  const { cards, toggleFreeze, setLimit } = useBank();
  const [activeId, setActiveId] = useState(
    cards.find((card) => !card.physical)?.id ?? cards[0]!.id,
  );
  const [revealed, setRevealed] = useState(true);
  const [controls, setControls] = useState({ online: true, atm: true, abroad: false });

  const card = cards.find((c) => c.id === activeId)!;
  const displayNumber = revealed
    ? card.number
    : `•••• •••• •••• ${card.number.replace(/\s/g, "").slice(-4)}`;

  return (
    <AppShell title="Cards & ATM">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex gap-2">
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setRevealed(false);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium",
                  c.id === activeId
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <VirtualCard card={card} revealed={revealed} />

          <div className="flex gap-2">
            <button
              onClick={() => setRevealed((v) => !v)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium"
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {revealed ? "Hide details" : "Show details"}
            </button>
            <button
              onClick={() => {
                toggleFreeze(card.id);
                toast(card.frozen ? "Card unfrozen" : "Card frozen");
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl gold-surface py-2.5 text-sm font-semibold"
            >
              <Snowflake className="h-4 w-4" />
              {card.frozen ? "Unfreeze" : "Freeze card"}
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Card details</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {revealed ? "Full card number visible" : "Card number protected"}
                </p>
              </div>
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                  card.frozen
                    ? "bg-secondary text-muted-foreground"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
                )}
              >
                <CheckCircle2 className="h-3 w-3" /> {card.frozen ? "Frozen" : "Active"}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-4">
              <div className="col-span-2 min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Card number
                </dt>
                <dd className="mt-1 flex items-center gap-2 truncate font-mono text-xs font-semibold">
                  {displayNumber}
                  {revealed && (
                    <button
                      type="button"
                      aria-label="Copy card number"
                      title="Copy card number"
                      onClick={() => {
                        navigator.clipboard?.writeText(card.number);
                        toast.success("Card number copied");
                      }}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Expires
                </dt>
                <dd className="mt-1 font-semibold">{card.expiry}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Type
                </dt>
                <dd className="mt-1 font-semibold">{card.physical ? "Physical" : "Virtual"}</dd>
              </div>
            </dl>
          </div>

          <p className="text-xs text-muted-foreground">
            Keep your card details secure. You can freeze or adjust this card at any time.
          </p>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Monthly spend limit</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatUSD(card.spent)} used of {formatUSD(card.limit)}
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (card.spent / card.limit) * 100)}%`,
                  background: "var(--gradient-gold)",
                }}
              />
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={card.limit}
              onChange={(e) => setLimit(card.id, Number(e.target.value))}
              className="mt-4 w-full accent-[var(--primary)]"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Card controls</h2>
            <div className="mt-3 divide-y divide-border">
              {[
                { key: "online" as const, label: "Online payments", icon: ShoppingBag },
                { key: "atm" as const, label: "ATM withdrawals", icon: Lock },
                { key: "abroad" as const, label: "Payments abroad", icon: Globe },
              ].map((c) => (
                <div key={c.key} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-3 text-sm">
                    <c.icon className="h-4 w-4 text-primary" />
                    {c.label}
                  </span>
                  <button
                    role="switch"
                    aria-checked={controls[c.key]}
                    aria-label={c.label}
                    onClick={() => setControls((p) => ({ ...p, [c.key]: !p[c.key] }))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors",
                      controls[c.key] ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all",
                        controls[c.key] ? "left-[22px]" : "left-0.5",
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-base font-semibold">Rewards</h2>
            <p className="mt-1 text-sm text-muted-foreground">1,840 points · 160 to next tier</p>
            <div className="mt-3 h-2 w-full rounded-full bg-secondary">
              <div className="h-full w-[92%] rounded-full bg-[var(--success)]" />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
