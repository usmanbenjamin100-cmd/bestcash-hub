import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Fingerprint, Bell, LifeBuoy, Globe, Save } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { profile } from "@/data/bank";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Security — BestCash Demo Banking" },
      {
        name: "description",
        content:
          "Demo profile, security toggles and support options for the BestCash banking prototype.",
      },
      { property: "og:title", content: "Profile & Security — BestCash Demo Banking" },
      {
        property: "og:description",
        content: "Manage demo profile settings and security preferences.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [prefs, setPrefs] = useState({ biometrics: true, alerts: true, travel: false });
  const [form, setForm] = useState({
    fullName: profile.fullName,
    username: profile.username,
    email: profile.email,
    country: profile.country,
  });
  const [saved, setSaved] = useState(false);

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary">
              <img
                src="/bestcash-logo.jpeg"
                alt="BestCash profile mark"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{form.fullName}</h2>
              <p className="text-sm text-muted-foreground">
                @{form.username} · {form.country}
              </p>
              <span className="mt-1 inline-block rounded-full border border-primary/50 px-2 py-0.5 text-[11px] text-primary">
                {profile.tier} · member since {profile.memberSince}
              </span>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["fullName", "Full name", "text"],
              ["username", "Username", "text"],
              ["email", "Email address", "email"],
              ["country", "Country", "text"],
            ].map(([key, label, type]) => (
              <label key={key} className="text-xs font-medium text-muted-foreground">
                {label}
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => {
                    setSaved(false);
                    setForm({ ...form, [key]: e.target.value });
                  }}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
            ))}
          </div>
          <button
            onClick={() => {
              setSaved(true);
              toast.success("Profile saved", { description: "Demo details updated locally." });
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl gold-surface px-4 py-2.5 text-sm font-semibold"
          >
            <Save className="h-4 w-4" /> {saved ? "Saved" : "Save profile"}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Security</h3>
          <div className="mt-3 divide-y divide-border">
            {[
              { key: "biometrics" as const, label: "Biometric unlock", icon: Fingerprint },
              { key: "alerts" as const, label: "Transaction alerts", icon: Bell },
              { key: "travel" as const, label: "Travel mode", icon: Globe },
            ].map((p) => (
              <div key={p.key} className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3 text-sm">
                  <p.icon className="h-4 w-4 text-primary" />
                  {p.label}
                </span>
                <button
                  role="switch"
                  aria-checked={prefs[p.key]}
                  aria-label={p.label}
                  onClick={() => setPrefs((v) => ({ ...v, [p.key]: !v[p.key] }))}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    prefs[p.key] ? "bg-primary" : "bg-secondary",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all",
                      prefs[p.key] ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Support</h3>
          <button
            onClick={() =>
              toast("Demo support", { description: "Chat is not available in this prototype." })
            }
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm hover:border-primary/60"
          >
            <LifeBuoy className="h-4 w-4 text-primary" /> Contact support
          </button>
        </div>

        <p className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          BestCash is a fictional prototype for design and demo purposes only. It is not a bank and
          never handles real money or real credentials.
        </p>
      </div>
    </AppShell>
  );
}
