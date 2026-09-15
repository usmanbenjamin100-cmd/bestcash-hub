function activeMoneyFormat() {
  const isCanadianAccount =
    typeof window !== "undefined" &&
    window.localStorage.getItem("bestcash-account") === "keanureeves22333";

  return isCanadianAccount
    ? { locale: "en-CA", currency: "CAD" }
    : { locale: "en-US", currency: "USD" };
}

export function formatUSD(amount: number, opts: { compact?: boolean } = {}) {
  const { locale, currency } = activeMoneyFormat();
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: opts.compact ? "compact" : "standard",
    maximumFractionDigits: 2,
    minimumFractionDigits: opts.compact ? 0 : 2,
  }).format(amount);
}

export function formatCrypto(amount: number, symbol: string) {
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 6 })} ${symbol}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function maskCard(number: string) {
  const last4 = number.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export const formatSEK = formatUSD;
