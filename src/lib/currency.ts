export function formatUSD(amount: number, opts: { compact?: boolean } = {}) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "USD",
    notation: opts.compact ? "compact" : "standard",
    maximumFractionDigits: opts.compact ? 2 : 2,
    minimumFractionDigits: opts.compact ? 0 : 2,
  }).format(amount);
}

export function formatCrypto(amount: number, symbol: string) {
  return `${amount.toLocaleString("sv-SE", { maximumFractionDigits: 6 })} ${symbol}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function maskCard(number: string) {
  const last4 = number.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export const formatSEK = formatUSD;
