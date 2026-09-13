import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — BestCash Banking" },
      { name: "description", content: "Sign in securely to BestCash online banking." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (login(username, pin)) {
      toast.success("Welcome to BestCash");
      navigate({ to: "/" });
    } else {
      setError("That username or login PIN doesn’t match.");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[oklch(0.22_0.03_65)] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[oklch(0.67_0.15_67)/20] blur-3xl" />
          <div className="relative">
            <BrandLogo size={42} />
          </div>
          <div className="relative max-w-lg">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Private banking
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight">
              Your money,
              <br />
              <span className="gold-text">beautifully clear.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/60">
              A calm, high-touch banking experience built around the way you manage your money.
            </p>
          </div>
          <p className="relative text-xs text-white/40">
            BestCash keeps your account experience clear, secure and personal.
          </p>
        </section>
        <section className="flex items-center justify-center bg-background px-5 py-10 text-foreground sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <BrandLogo size={40} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Welcome back
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
              Sign in to BestCash
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to view your accounts, cards, transfers and investments.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-medium">
                Username or email
                <span className="relative mt-2 block">
                  <UserRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter your username or email"
                    className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </span>
              </label>
              <label className="block text-sm font-medium">
                Login PIN
                <span className="relative mt-2 block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoComplete="current-password"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((value) => !value)}
                    className="absolute right-3 top-2.5 rounded-md p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              {error && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl gold-surface py-3.5 text-sm font-semibold shadow-[var(--shadow-gold)]"
              >
                Sign in <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-4 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              For your security, never share your password or transaction PIN. BestCash support will
              never ask for them.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
