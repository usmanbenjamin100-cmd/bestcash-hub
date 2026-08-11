import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Fingerprint,
  Globe2,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  UserRound,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useBank } from "@/lib/bank-store";
import { formatUSD } from "@/lib/currency";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Security — BestCash Banking" },
      {
        name: "description",
        content: "Review your BestCash identity, account details and security status.",
      },
      { property: "og:title", content: "Profile & Security — BestCash Banking" },
      {
        property: "og:description",
        content: "A read-only view of your BestCash account identity and security status.",
      },
    ],
  }),
  component: ProfilePage,
});

const securityItems = [
  {
    label: "Biometrisk upplåsning",
    detail: "Tillgänglig på den här enheten",
    icon: Fingerprint,
    status: "Aktiverad",
  },
  {
    label: "Transaktionsaviseringar",
    detail: "Direktaviseringar för kontoaktivitet",
    icon: Bell,
    status: "Aktiverad",
  },
  {
    label: "Reseskydd",
    detail: "Ingen reseanmälan är aktiv just nu",
    icon: Globe2,
    status: "Av",
  },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DetailRow({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/70 py-4 last:border-0 last:pb-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-1 truncate text-sm font-semibold text-foreground">{value}</dd>
        {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { profile, accounts, totalBalance } = useBank();
  const memberSince = new Date(`${profile.memberSince}-01-01T00:00:00Z`).toLocaleDateString(
    "sv-SE",
    { month: "short", year: "numeric" },
  );

  return (
    <AppShell title="Profil">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Kontocenter
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Din profil
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              En tydlig översikt över identiteten och säkerhetsinställningarna kopplade till ditt BestCash-konto.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="live-dot" />
            Kontotjänster aktiva
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-[oklch(0.34_0.06_65)] bg-[oklch(0.28_0.045_65)] p-6 text-white elev sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--gradient-gold)" }}
          />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border border-white/20 bg-white/10 font-display text-2xl font-semibold text-primary shadow-inner">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={`${profile.fullName} profile`}
                    className="h-full w-full rounded-[1.5rem] object-cover"
                  />
                ) : (
                  initials(profile.fullName)
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold">{profile.fullName}</h3>
                  <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verifierad profil" />
                </div>
                <p className="mt-1 text-sm text-white/65">
                  @{profile.username} · {profile.country}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
                    {profile.tier}-medlem
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-white/75">
                    Medlem sedan {memberSince}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-5 sm:min-w-[250px] sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Totalt engagemang
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold">
                  {formatUSD(totalBalance, { compact: true })}
                </p>
                <p className="mt-1 text-xs text-emerald-300">Över {accounts.length} konton</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Kontostatus
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 font-display text-xl font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Aktivt
                </p>
                <p className="mt-1 text-xs text-white/55">Utan anmärkningar</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Identitet
                </p>
                <h3 className="mt-1.5 text-lg font-semibold">Personuppgifter</h3>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <LockKeyhole className="h-3 w-3 text-primary" /> Hanteras av BestCash
              </span>
            </div>
            <dl className="mt-3">
              <DetailRow icon={UserRound} label="Fullständigt namn" value={profile.fullName} />
              <DetailRow icon={Mail} label="E-postadress" value={profile.email} />
              <DetailRow icon={MapPin} label="Bosättningsland" value={profile.country} />
              <DetailRow
                icon={Globe2}
                label="Språk"
                value={profile.language}
                detail="Språket som används i hela BestCash"
              />
              <DetailRow
                icon={WalletCards}
                label="Basvaluta"
                value={profile.currency}
                detail="Används för din primära kontovy"
              />
            </dl>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                Dina personuppgifter är skyddade och kan inte ändras från den här sidan. Kontakta
                supporten om dina uppgifter behöver ses över.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Skydd
                </p>
                <h3 className="mt-1.5 text-lg font-semibold">Säkerhetsstatus</h3>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                <Check className="h-3 w-3" /> Stark
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {securityItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl px-2 py-3.5 transition-colors hover:bg-secondary/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span
                    className={
                      item.status === "Aktiverad"
                        ? "rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300"
                        : "rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground"
                    }
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                Inloggnings- och transaktionsgodkännanden visas aldrig här.
              </p>
            </div>
          </section>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <section className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <CalendarDays className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Kontohistorik</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Din relation med BestCash började {profile.memberSince}.
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-4/5 rounded-full bg-[var(--gradient-gold)]" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Signature-relation · etablerat konto
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <LifeBuoy className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Behöver du ändra något?</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Vårt supportteam kan hjälpa dig att se över kontouppgifter.
                </p>
              </div>
            </div>
            <Link
              to="/support"
              className="mt-4 flex min-h-11 items-center justify-between rounded-2xl border border-border px-3.5 text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-secondary/50"
            >
              Kontakta BestCash support
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </section>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold">Ditt konto är skyddat</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                BestCash frågar aldrig efter din inloggnings-PIN eller transaktions-PIN via e-post, meddelande
                eller telefon.
              </p>
            </div>
          </div>
          <ArrowRight className="mt-0.5 hidden h-4 w-4 shrink-0 text-primary sm:block" />
        </div>
      </div>
    </AppShell>
  );
}
