import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { formatUSD } from "@/lib/currency";
import { getAccountRecord, recipients } from "@/data/bank";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "Transfers — BestCash Banking" },
      {
        name: "description",
        content: "Send money securely between your BestCash accounts and saved recipients.",
      },
      { property: "og:title", content: "Transfers — BestCash Banking" },
      {
        property: "og:description",
        content: "Review transfer fees and recipient details before sending.",
      },
    ],
  }),
  component: TransfersPage,
});

const FEE_RATE = 0.005;
const WITHDRAWAL_SUPPORT_MESSAGE =
  "For your protection, contact BestCash Support for withdrawal assistance so we can verify the request and help you complete it securely.";

function TransfersPage() {
  const { accounts } = useBank();
  const { accountUsername } = useAuth();
  const credentials = getAccountRecord(accountUsername).credentials;
  const [from, setFrom] = useState(accounts[0]!.id);
  const [recipientId, setRecipientId] = useState(recipients[0]!.id);
  const [amount, setAmount] = useState("250");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"form" | "review" | "blocked">("form");
  const [transactionPin, setTransactionPin] = useState("");
  const [saveRecipient, setSaveRecipient] = useState(false);

  const recipient = recipients.find((r) => r.id === recipientId)!;
  const account = accounts.find((a) => a.id === from)!;
  const value = Number(amount) || 0;
  const fee = value * FEE_RATE;
  const total = value + fee;
  const insufficient = total > account.balance;
  const invalid = value <= 0 || insufficient;
  const invalidPin =
    transactionPin.length === 4 && transactionPin !== credentials.transactionPin;

  function confirm() {
    if (transactionPin !== credentials.transactionPin) {
      toast.error("Enter your transaction PIN to continue");
      return;
    }
    if (saveRecipient) {
      window.localStorage.setItem("bestcash-saved-recipient", recipient.id);
    }
    setStep("blocked");
    toast.error("Withdrawal assistance required", {
      description: WITHDRAWAL_SUPPORT_MESSAGE,
      duration: 8000,
    });
  }

  return (
    <AppShell title="Transfers">
      <div className="mx-auto grid max-w-3xl gap-5">
        {step === "blocked" ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center elev">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Withdrawal assistance required</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your payment request for {formatUSD(value)} to {recipient.name} has been paused for
              account protection.
            </p>
            <p className="mt-4 rounded-2xl bg-secondary/70 p-4 text-sm leading-6 text-foreground">
              {WITHDRAWAL_SUPPORT_MESSAGE}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              The request was not sent and your account balance was unchanged.
            </p>
            <button
              onClick={() => setStep("form")}
              className="mt-6 rounded-xl gold-surface px-5 py-2.5 text-sm font-semibold"
            >
              Try another transfer
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold">Recipient</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {recipients.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRecipientId(r.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                      r.id === recipientId
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full gold-surface text-sm font-bold">
                      {r.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{r.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.bank} · {r.account}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold">Amount</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">From account</label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {formatUSD(a.balance)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Transaction PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={transactionPin}
                    onChange={(e) =>
                      setTransactionPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
                    }
                    placeholder="4-digit PIN"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={saveRecipient}
                    onChange={(e) => setSaveRecipient(e.target.checked)}
                    className="accent-[var(--primary)]"
                  />
                  Save this recipient for later transfers
                </label>
                <div>
                  <label className="text-xs text-muted-foreground">Belopp (SEK)</label>
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-3 font-display text-2xl font-semibold outline-none focus:border-primary"
                  />
                  <div className="mt-2 flex gap-2">
                    {[100, 250, 500, 1000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setAmount(String(v))}
                        className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
                      >
                        ${v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Note (optional)</label>
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 60))}
                    placeholder="Dinner, rent, gift…"
                    className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2 rounded-xl bg-secondary/60 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer fee (0.5%)</span>
                  <span>{formatUSD(fee)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total debited</span>
                  <span>{formatUSD(total)}</span>
                </div>
              </div>

              {insufficient && (
                <p className="mt-3 text-sm text-destructive">
                  Insufficient balance in {account.name}.
                </p>
              )}

              {step === "form" ? (
                <button
                  disabled={invalid || transactionPin !== credentials.transactionPin}
                  onClick={() => setStep("review")}
                  className="mt-5 w-full rounded-xl gold-surface py-3 text-sm font-semibold disabled:opacity-40"
                >
                  Review transfer
                </button>
              ) : (
                <div className="mt-5 space-y-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Sending {formatUSD(value)} to {recipient.name} from {account.name}.
                  </p>
                  {invalidPin && (
                    <p className="text-xs text-destructive">
                      That transaction PIN does not match your account.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep("form")}
                      className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirm}
                      className="flex-1 rounded-xl gold-surface py-3 text-sm font-semibold"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}