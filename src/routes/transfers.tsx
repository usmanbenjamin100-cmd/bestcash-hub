import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, ChevronRight, ImagePlus, Plus, ShieldCheck, Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { formatUSD } from "@/lib/currency";
import { type Recipient, getAccountRecord } from "@/data/bank";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "Transfers — BestCash Banking" },
      { name: "description", content: "Review recipient and transfer details before sending a BestCash payment request." },
      { property: "og:title", content: "Transfers — BestCash Banking" },
      { property: "og:description", content: "Choose a saved recipient, review fees and confirm your transfer request." },
    ],
  }),
  component: TransfersPage,
});

const FEE_RATE = 0.005;
const WITHDRAWAL_SUPPORT_MESSAGE =
  "For your protection, contact BestCash Support for withdrawal assistance so we can verify the request and help you complete it securely.";
const MAX_RECIPIENT_IMAGE_BYTES = 512 * 1024;

function RecipientAvatar({ recipient, large = false }: { recipient: Recipient; large?: boolean }) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-full gold-surface text-xs font-bold text-foreground", large ? "h-12 w-12" : "h-10 w-10")}>
      {recipient.avatar ? <img src={recipient.avatar} alt={recipient.name + " profile"} className="h-full w-full object-cover" /> : recipient.initials}
    </span>
  );
}

function TransfersPage() {
  const { accounts, recipients, addRecipient } = useBank();
  const { accountUsername } = useAuth();
  const credentials = getAccountRecord(accountUsername).credentials;
  const [from, setFrom] = useState(accounts[0]!.id);
  const [recipientId, setRecipientId] = useState(recipients[0]!.id);
  const [amount, setAmount] = useState("250");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"form" | "review" | "blocked">("form");
  const [transactionPin, setTransactionPin] = useState("");
  const [showRecipientForm, setShowRecipientForm] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [accountLastFour, setAccountLastFour] = useState("");
  const [avatar, setAvatar] = useState("");

  const recipient = recipients.find((item) => item.id === recipientId) ?? recipients[0]!;
  const account = accounts.find((item) => item.id === from) ?? accounts[0]!;
  const value = Number(amount) || 0;
  const fee = value * FEE_RATE;
  const total = value + fee;
  const insufficient = total > account.balance;
  const invalid = value <= 0 || insufficient;
  const invalidPin = transactionPin.length === 4 && transactionPin !== credentials.transactionPin;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > MAX_RECIPIENT_IMAGE_BYTES) {
      toast.error("Choose an image smaller than 512 KB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatar(reader.result);
    };
    reader.onerror = () => toast.error("That image could not be read. Try another file.");
    reader.readAsDataURL(file);
  }

  function saveRecipient() {
    const name = recipientName.trim();
    const bank = recipientBank.trim();
    if (!name || !bank || accountLastFour.length !== 4) {
      toast.error("Enter the recipient’s name, bank and last four account digits.");
      return;
    }
    const parts = name.split(/\s+/);
    const newRecipient: Recipient = {
      id: "custom-" + Date.now(),
      name,
      bank,
      account: "•••• " + accountLastFour,
      initials: parts.slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase(),
      ...(avatar ? { avatar } : {}),
    };
    try {
      addRecipient(newRecipient);
      setRecipientId(newRecipient.id);
      setRecipientName("");
      setRecipientBank("");
      setAccountLastFour("");
      setAvatar("");
      setShowRecipientForm(false);
      toast.success("Recipient saved on this device.");
    } catch {
      toast.error("Recipient could not be saved. Check available browser storage and try again.");
    }
  }

  function confirm() {
    if (transactionPin !== credentials.transactionPin) {
      toast.error("Enter your transaction PIN to continue.");
      return;
    }
    setStep("blocked");
    toast.error("Withdrawal assistance required", {
      description: WITHDRAWAL_SUPPORT_MESSAGE,
      duration: 8000,
    });
  }

  return (
    <AppShell title="Transfers">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Move money</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{step === "review" ? "Check the details." : "Send money"}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{step === "review" ? "Confirm the recipient, source account and fee before continuing." : "Choose a saved recipient and review your transfer request before it is submitted."}</p>
        </div>

        {step === "blocked" ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10"><AlertTriangle className="h-7 w-7 text-destructive" /></div>
            <h3 className="mt-4 text-xl font-semibold">Withdrawal assistance required</h3>
            <p className="mt-2 text-sm text-muted-foreground">Your request for {formatUSD(value)} to {recipient.name} has been paused for account protection.</p>
            <p className="mt-4 rounded-2xl bg-secondary/70 p-4 text-sm leading-6 text-foreground">{WITHDRAWAL_SUPPORT_MESSAGE}</p>
            <p className="mt-4 text-xs text-muted-foreground">The request was not sent and your account balance was unchanged.</p>
            <button onClick={() => setStep("form")} className="mt-6 rounded-xl gold-surface px-5 py-2.5 text-sm font-semibold">Back to transfer</button>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                {step === "review" ? (
                  <div className="flex items-center gap-3 border-b border-border pb-5"><button onClick={() => setStep("form")} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground" aria-label="Back to transfer details"><ChevronRight className="h-4 w-4 rotate-180" /></button><div><h3 className="text-sm font-semibold">Review transfer</h3><p className="mt-1 text-xs text-muted-foreground">No request continues until you confirm.</p></div><span className="ml-auto rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary">Step 2 of 2</span></div>
                ) : (
                  <div className="flex items-center justify-between gap-3 border-b border-border pb-5"><div><h3 className="text-sm font-semibold">New transfer</h3><p className="mt-1 text-xs text-muted-foreground">Review the details before submission.</p></div><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-primary">Fee {formatUSD(fee)}</span></div>
                )}

                {step === "form" ? (
                  <div className="mt-5 space-y-5">
                    <div><label htmlFor="source-account" className="mb-2 block text-xs font-semibold">From account</label><select id="source-account" value={from} onChange={(event) => setFrom(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">{accounts.map((item) => <option key={item.id} value={item.id}>{item.name} · {formatUSD(item.balance)}</option>)}</select></div>
                    <div><div className="mb-2 flex items-center justify-between gap-3"><span className="text-xs font-semibold">To recipient</span><button type="button" onClick={() => setShowRecipientForm(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Plus className="h-3.5 w-3.5" /> Add recipient</button></div><div className="grid gap-2 sm:grid-cols-2">{recipients.map((item) => <button key={item.id} type="button" onClick={() => setRecipientId(item.id)} className={cn("flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-colors", item.id === recipient.id ? "border-primary bg-secondary/60 ring-2 ring-primary/10" : "border-border hover:border-primary/50")}><RecipientAvatar recipient={item} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{item.name}</span><span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{item.bank} · {item.account}</span></span>{item.id === recipient.id && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}</button>)}</div></div>
                    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="transfer-amount" className="mb-2 block text-xs font-semibold">Amount ({profileCurrencyLabel()})</label><div className="relative"><span className="absolute left-3.5 top-3 text-sm text-muted-foreground">$</span><input id="transfer-amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))} className="h-11 w-full rounded-xl border border-input bg-background pl-8 pr-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" aria-invalid={invalid} /></div><div className="mt-2 flex flex-wrap gap-2">{[100, 250, 500, 1000].map((quickAmount) => <button key={quickAmount} type="button" onClick={() => setAmount(String(quickAmount))} className="rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary hover:text-foreground">+{formatUSD(quickAmount)}</button>)}</div></div><div><label htmlFor="transfer-note" className="mb-2 block text-xs font-semibold">Note (optional)</label><input id="transfer-note" value={note} onChange={(event) => setNote(event.target.value.slice(0, 60))} placeholder="What’s this for?" className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></div></div>
                    <div className="rounded-xl bg-secondary/50 p-4"><div className="flex justify-between gap-3 text-xs"><span className="text-muted-foreground">Transfer fee (0.5%)</span><span>{formatUSD(fee)}</span></div><div className="mt-2 flex justify-between gap-3 text-sm font-semibold"><span>Total requested</span><span>{formatUSD(total)}</span></div></div>
                    {insufficient && <p className="text-xs font-medium text-destructive" role="alert">This amount is more than the available balance in {account.name}.</p>}
                    <button disabled={invalid} onClick={() => setStep("review")} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl gold-surface text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">Review transfer <ChevronRight className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="mt-5">
                    <div className="flex items-center gap-3"><RecipientAvatar recipient={recipient} large /><div className="min-w-0"><p className="truncate text-sm font-semibold">{recipient.name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{recipient.bank} · {recipient.account}</p></div></div>
                    <div className="mt-5 space-y-3 rounded-xl bg-secondary/50 p-4"><div className="flex justify-between gap-4 text-xs"><span className="text-muted-foreground">Sending from</span><span className="text-right font-medium">{account.name}</span></div><div className="flex justify-between gap-4 text-xs"><span className="text-muted-foreground">Amount</span><span className="text-right text-base font-bold">{formatUSD(value)}</span></div><div className="flex justify-between gap-4 border-t border-border pt-3 text-xs"><span className="text-muted-foreground">Transfer fee</span><span>{formatUSD(fee)}</span></div><div className="flex justify-between gap-4 border-t border-border pt-3 text-sm font-semibold"><span>Total requested</span><span>{formatUSD(total)}</span></div>{note.trim() && <div className="flex justify-between gap-4 border-t border-border pt-3 text-xs"><span className="text-muted-foreground">Note</span><span className="max-w-[65%] truncate text-right font-medium">{note}</span></div>}</div>
                    <div className="mt-5"><label htmlFor="transaction-pin" className="mb-2 block text-xs font-semibold">Transaction PIN</label><input id="transaction-pin" type="password" inputMode="numeric" autoComplete="off" value={transactionPin} onChange={(event) => setTransactionPin(event.target.value.replace(/[^0-9]/g, "").slice(0, 4))} placeholder="Enter your 4-digit PIN" className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" aria-invalid={invalidPin} />{invalidPin && <p className="mt-2 text-xs text-destructive" role="alert">That transaction PIN does not match your account.</p>}</div>
                    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Your request remains protected. A withdrawal confirmation may require support verification.</p>
                    <div className="mt-5 flex gap-2"><button onClick={() => setStep("form")} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold">Back</button><button onClick={confirm} disabled={transactionPin.length !== 4 || invalidPin} className="flex flex-1 items-center justify-center gap-2 rounded-xl gold-surface py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"><ShieldCheck className="h-4 w-4" /> Confirm request</button></div>
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-bold">Saved recipients</h3><p className="mt-1 text-xs text-muted-foreground">Stored on this device for this account</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold">{recipients.length}</span></div><div className="mt-4 space-y-1">{recipients.map((item) => <button key={item.id} type="button" onClick={() => { setRecipientId(item.id); setStep("form"); }} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-secondary/60"><RecipientAvatar recipient={item} /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{item.name}</span><span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{item.bank} · {item.account}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></button>)}</div></section>
              <section className="rounded-2xl bg-[oklch(0.28_0.045_65)] p-5 text-white"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><h3 className="text-xs font-bold">Protected by BestCash</h3></div><p className="mt-3 text-xs leading-relaxed text-white/65">Transfers are reviewed before submission. This MVP does not move real funds; requests requiring withdrawal are paused for support verification.</p></section>
            </aside>
          </div>
        )}

        {showRecipientForm && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setShowRecipientForm(false)}><section role="dialog" aria-modal="true" aria-labelledby="add-recipient-title" className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between gap-3"><div><h3 id="add-recipient-title" className="text-base font-semibold">Add recipient</h3><p className="mt-1 text-xs text-muted-foreground">Saved locally in this browser.</p></div><button type="button" onClick={() => setShowRecipientForm(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Close recipient form"><X className="h-4 w-4" /></button></div><div className="mt-5 space-y-4"><div><label htmlFor="recipient-name" className="mb-2 block text-xs font-semibold">Full name</label><input id="recipient-name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="Recipient name" className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary" /></div><div><label htmlFor="recipient-bank" className="mb-2 block text-xs font-semibold">Bank or institution</label><input id="recipient-bank" value={recipientBank} onChange={(event) => setRecipientBank(event.target.value)} placeholder="Bank name" className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary" /></div><div><label htmlFor="recipient-account-last-four" className="mb-2 block text-xs font-semibold">Account reference</label><input id="recipient-account-last-four" inputMode="numeric" maxLength={4} value={accountLastFour} onChange={(event) => setAccountLastFour(event.target.value.replace(/[^0-9]/g, "").slice(0, 4))} placeholder="Last four digits only" className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-primary" /><p className="mt-1.5 text-[10px] text-muted-foreground">Only the final four digits are stored in this MVP.</p></div><div><span className="mb-2 block text-xs font-semibold">Recipient picture (optional)</span><label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input px-3 text-xs text-muted-foreground hover:border-primary"><ImagePlus className="h-4 w-4" /><span className="flex-1">{avatar ? "Picture selected" : "Choose an image (512 KB max)"}</span>{avatar && <img src={avatar} alt="Selected recipient" className="h-8 w-8 rounded-full object-cover" />}<input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} /></label></div><div className="flex gap-2 pt-1"><button type="button" onClick={() => setShowRecipientForm(false)} className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold">Cancel</button><button type="button" onClick={saveRecipient} className="flex-1 rounded-xl gold-surface py-3 text-sm font-semibold">Save recipient</button></div></div></section></div>}
      </div>
    </AppShell>
  );
}

function profileCurrencyLabel() {
  if (typeof window === "undefined") return "USD";
  return window.localStorage.getItem("bestcash-account") === "keanureeves22333" ? "CAD" : "USD";
}
