import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { cryptoHoldings } from "@/data/bank";
import { formatUSD, formatCrypto } from "@/lib/currency";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crypto")({
  head: () => ({
    meta: [
      { title: "Crypto Wallet — BestCash Banking" },
      {
        name: "description",
        content: "Track BTC, ETH, SOL and USDC holdings with the BestCash crypto wallet.",
      },
      { property: "og:title", content: "Crypto Wallet — BestCash Banking" },
      {
        property: "og:description",
        content: "Track your crypto portfolio and place orders.",
      },
    ],
  }),
  component: CryptoPage,
});

function CryptoPage() {
  const [holdings, setHoldings] = useState(cryptoHoldings);
  const [selected, setSelected] = useState(cryptoHoldings[0]!.symbol);
  const [buyAmount, setBuyAmount] = useState("100");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTicks((value) => value + 1);
      setLastUpdated(new Date());
      setHoldings((previous) =>
        previous.map((holding, index) => ({
          ...holding,
          price: holding.price * (1 + Math.sin(Date.now() / 2600 + index) * 0.0008),
          change: Number((holding.change + Math.sin(Date.now() / 3800 + index) * 0.05).toFixed(2)),
        })),
      );
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const total = holdings.reduce((s, h) => s + h.amount * h.price, 0);
  const asset = holdings.find((h) => h.symbol === selected)!;
  const chart = useMemo(
    () =>
      Array.from(
        { length: 18 },
        (_, index) => 42 + Math.sin(index * 0.8 + ticks / 4) * 13 + index * 0.9,
      ),
    [ticks],
  );

  function buy() {
    const usd = Number(buyAmount) || 0;
    if (usd <= 0) return;
    setHoldings((prev) =>
      prev.map((h) => (h.symbol === selected ? { ...h, amount: h.amount + usd / h.price } : h)),
    );
    toast.success(`Bought ${formatUSD(usd)} of ${selected}`, { description: "Order submitted" });
  }

  return (
    <AppShell title="Crypto">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-border bg-card p-6 elev">
            <p className="text-sm text-muted-foreground">Portfolio value</p>
            <p className="mt-1 font-display text-4xl font-semibold">{formatUSD(total)}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-[var(--success)]">
              <span className="live-dot" /> +1.8% today{" "}
              <span className="text-xs text-muted-foreground">
                Market updated{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <svg
              viewBox="0 0 360 100"
              preserveAspectRatio="none"
              className="mt-6 h-28 w-full overflow-visible"
            >
              <defs>
                <linearGradient id="cryptoFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--primary)" stopOpacity=".34" />
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0 100 L ${chart.map((point, index) => `${(index / (chart.length - 1)) * 360} ${100 - point}`).join(" L ")} L 360 100 Z`}
                fill="url(#cryptoFill)"
              />
              <polyline
                points={chart
                  .map((point, index) => `${(index / (chart.length - 1)) * 360},${100 - point}`)
                  .join(" ")}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
              />
            </svg>
            <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 text-xs">
              <div>
                <p className="text-muted-foreground">24h volume</p>
                <p className="mt-1 font-semibold">$53.0B</p>
              </div>
              <div>
                <p className="text-muted-foreground">Market cap</p>
                <p className="mt-1 font-semibold">$1.7T</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assets held</p>
                <p className="mt-1 font-semibold">{holdings.length}</p>
              </div>
            </div>
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
            <p className="text-xs text-muted-foreground">
              Prices update periodically. Review market conditions before placing an order.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
