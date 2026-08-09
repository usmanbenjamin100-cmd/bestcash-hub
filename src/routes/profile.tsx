import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Fingerprint,
  Bell,
  LifeBuoy,
  Globe,
  Save,
  Camera,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Security — BestCash Banking" },
      {
        name: "description",
        content: "Manage your BestCash profile, security settings and support preferences.",
      },
      { property: "og:title", content: "Profile & Security — BestCash Banking" },
      {
        property: "og:description",
        content: "Manage your profile settings and security preferences.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, setProfile } = useBank();
  const [prefs, setPrefs] = useState({ biometrics: true, alerts: true, travel: false });
  const [form, setForm] = useState({
    fullName: profile.fullName,
    username: profile.username,
    email: profile.email,
    country: profile.country,
  });
  const [saved, setSaved] = useState(false);

  function onAvatarChange(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 2_000_000) {
      toast.error("Please choose an image under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, avatar: String(reader.result) });
      toast.success("Profile picture updated");
    };
    reader.readAsDataURL(file);
  }

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-secondary text-lg font-bold text-primary ring-4 ring-primary/10">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`${form.fullName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                form.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
              )}
              <label className="absolute inset-x-0 bottom-0 flex cursor-pointer items-center justify-center gap-1 bg-black/60 py-1 text-[10px] font-medium text-white">
                <Camera className="h-3 w-3" /> Edit
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => onAvatarChange(e.target.files?.[0])}
                />
              </label>
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
          {profile.avatar && (
            <button
              onClick={() => {
                const { avatar: _avatar, ...withoutAvatar } = profile;
                setProfile(withoutAvatar);
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove profile picture
            </button>
          )}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["fullName", "Full name", "text"],
                ["username", "Username", "text"],
                ["email", "Email address", "email"],
                ["country", "Country", "text"],
              ] as const
            ).map(([key, label, type]) => (
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
              setProfile({ ...profile, ...form });
              setSaved(true);
              toast.success("Profile saved", { description: "Your account details were updated." });
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
          <a
            href="/support"
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm hover:border-primary/60"
          >
            <span className="flex items-center gap-3">
              <LifeBuoy className="h-4 w-4 text-primary" /> Contact support
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>

        <p className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          Your account security matters. Keep your sign-in and transaction PINs private and never
          share them with anyone.
        </p>
      </div>
    </AppShell>
  );
}
