import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { cryptoHoldings } from "@/data/bank";
import { formatUSD, formatCrypto } from "@/lib/currency";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crypto")({
  head: () => ({
    meta: [
      { title: "Crypto Wallet — BestCash Demo Banking" },
      {
        name: "description",
        content: "A simulated crypto wallet with fictional BTC, ETH, SOL and USDC holdings inside the BestCash prototype.",
      },
      { property: "og:title", content: "Crypto Wallet — BestCash Demo Banking" },
      { property: "og:description", content: "Track a fictional crypto portfolio and simulate buys." },
    ],
  }),
  component: CryptoPage,
});

function CryptoPage() {
  const [holdings, setHoldings] = useState(cryptoHoldings);
  const [selected, setSelected] = useState(cryptoHoldings[0]!.symbol);
  const [buyAmount, setBuyAmount] = useState("100");

  const total = holdings.reduce((s, h) => s + h.amount * h.price, 0);
  const asset = holdings.find((h) => h.symbol === selected)!;

  function buy() {
    const usd = Number(buyAmount) || 0;
    if (usd <= 0) return;
    setHoldings((prev) =>
      prev.map((h) => (h.symbol === selected ? { ...h, amount: h.amount + usd / h.price } : h)),
    );
    toast.success(`Bought ${formatUSD(usd)} of ${selected}`, { description: "Simulated order" });
  }

  return (
    <AppShell title="Crypto">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 elev">
            <p className="text-sm text-muted-foreground">Portfolio value</p>
            <p className="mt-1 font-display text-4xl font-semibold">{formatUSD(total)}</p>
            <p className="mt-1 text-sm text-[var(--success)]">+1.8% today</p>
          </div>

          <div className="rounded-2xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {holdings.map((h) => (
                <li key={h.symbol} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full gold-surface text-xs font-bold">
                    {h.symbol}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCrypto(h.amount, h.symbol)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatUSD(h.amount * h.price)}</p>
                    <p
                      className={cn(
                        "text-xs",
                        h.change >= 0 ? "text-[var(--success)]" : "text-destructive",
                      )}
                    >
                      {h.change >= 0 ? "+" : ""}
                      {h.change}%
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold">Buy crypto</h2>
          <div className="mt-4 space-y-4">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {holdings.map((h) => (
                <option key={h.symbol} value={h.symbol}>
                  {h.name} ({h.symbol})
                </option>
              ))}
            </select>
            <input
              inputMode="decimal"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full rounded-xl border border-input bg-background px-3 py-3 font-display text-2xl font-semibold outline-none focus:border-primary"
            />
            <p className="text-xs text-muted-foreground">
              ≈ {formatCrypto((Number(buyAmount) || 0) / asset.price, asset.symbol)} at{" "}
              {formatUSD(asset.price)}
            </p>
            <button
              onClick={buy}
              className="w-full rounded-xl gold-surface py-3 text-sm font-semibold"
            >
              Buy {selected}
            </button>
            <p className="text-xs text-muted-foreground">Prices are static demo values.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
