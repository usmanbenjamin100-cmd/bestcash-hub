import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock3,
  FileQuestion,
  LifeBuoy,
  MessageSquareText,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Center — BestCash Demo Banking" },
      { name: "description", content: "Get help inside the fictional BestCash banking prototype." },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  [
    "Why did my transfer fail?",
    "BestCash transfer requests are intentionally simulated and never settle in this prototype.",
  ],
  [
    "Can I change my profile picture?",
    "Yes. Open Profile and use the Edit control on your avatar to choose an image from your device.",
  ],
  [
    "Are crypto prices real?",
    "No. The live ticker is a realistic local market simulation designed to make the demo feel alive.",
  ],
] as const;

const supportHighlights = [
  { Icon: Clock3, title: "Average reply", detail: "< 5 minutes" },
  { Icon: ShieldCheck, title: "Demo safe", detail: "No real funds" },
  { Icon: LifeBuoy, title: "Help center", detail: "Always open" },
] as const;

function SupportPage() {
  const [category, setCategory] = useState("Transfer issue");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState<string[]>([]);

  function sendMessage() {
    if (!message.trim()) {
      toast.error("Tell us a little about the issue first");
      return;
    }
    setSubmitted((items) => [`BC-${String(items.length + 1042).padStart(5, "0")}`, ...items]);
    setMessage("");
    toast.success("Support request created", {
      description: "A demo specialist will reply shortly.",
    });
  }

  return (
    <AppShell title="Support Center">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="relative overflow-hidden rounded-3xl bg-[oklch(0.28_0.045_65)] p-7 text-white elev">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <LifeBuoy className="h-6 w-6 text-primary" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                BestCash care
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">How can we help today?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                Get a quick answer or send a demo request to our support team. We’re here to make
                your tour feel effortless.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">Start a conversation</h2>
            </div>
            <div className="mt-5 space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground">
                What do you need help with?
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-normal text-foreground outline-none focus:border-primary"
                >
                  <option>Transfer issue</option>
                  <option>Profile & security</option>
                  <option>Crypto demo</option>
                  <option>Something else</option>
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted-foreground">
                Message
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Tell us about your ${category.toLowerCase()}...`}
                  rows={5}
                  className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm font-normal text-foreground outline-none focus:border-primary"
                />
              </label>
              <button
                onClick={sendMessage}
                className="inline-flex items-center gap-2 rounded-xl gold-surface px-4 py-2.5 text-sm font-semibold"
              >
                <Send className="h-4 w-4" /> Send request
              </button>
            </div>
            {submitted.length > 0 && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm">
                <CheckCircle2 className="mr-2 inline h-4 w-4 text-[var(--success)]" /> Request{" "}
                {submitted[0]} is open
              </div>
            )}
          </section>
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">Popular answers</h2>
            </div>
            <div className="mt-4 divide-y divide-border">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group py-3">
                  <summary className="cursor-pointer list-none text-sm font-medium">
                    {question}
                    <span className="float-right text-muted-foreground">+</span>
                  </summary>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {supportHighlights.map(({ Icon, title, detail }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-4">
              <Icon className="h-4 w-4 text-primary" />
              <p className="mt-3 text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
