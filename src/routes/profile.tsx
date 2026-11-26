import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Camera,
  CalendarDays,
  Check,
  ChevronRight,
  ImagePlus,
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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    label: "Biometric unlock",
    detail: "Available on this device",
    icon: Fingerprint,
    status: "Enabled",
  },
  {
    label: "Transaction alerts",
    detail: "Instant alerts for account activity",
    icon: Bell,
    status: "Enabled",
  },
  {
    label: "Travel protection",
    detail: "No travel notice is active right now",
    icon: Globe2,
    status: "Off",
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

const CROP_SIZE = 256;

function clampCropOffset(
  offset: { x: number; y: number },
  dimensions: { width: number; height: number },
  zoom: number,
) {
  const scale = Math.max(CROP_SIZE / dimensions.width, CROP_SIZE / dimensions.height) * zoom;
  const maxX = Math.max(0, (dimensions.width * scale - CROP_SIZE) / 2);
  const maxY = Math.max(0, (dimensions.height * scale - CROP_SIZE) / 2);
  return {
    x: Math.max(-maxX, Math.min(maxX, offset.x)),
    y: Math.max(-maxY, Math.min(maxY, offset.y)),
  };
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
  const { profile, accounts, totalBalance, saveProfileAvatar } = useBank();
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoSource, setPhotoSource] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [zoom, setZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const displayScale = imageDimensions
    ? Math.max(CROP_SIZE / imageDimensions.width, CROP_SIZE / imageDimensions.height) * zoom
    : 1;

  useEffect(() => {
    const source = photoSource;
    return () => {
      if (source?.startsWith("blob:")) URL.revokeObjectURL(source);
    };
  }, [photoSource]);

  function handlePhotoSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("Choose an image smaller than 12 MB.");
      return;
    }
    setPhotoSource(URL.createObjectURL(file));
    setImageDimensions(null);
    setZoom(1);
    setCropOffset({ x: 0, y: 0 });
  }

  function closePhotoEditor() {
    setPhotoEditorOpen(false);
    setPhotoSource(null);
    setImageDimensions(null);
    setZoom(1);
    setCropOffset({ x: 0, y: 0 });
  }

  function handleCropPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!imageDimensions) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: cropOffset.x,
      offsetY: cropOffset.y,
    };
  }

  function handleCropPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = dragStartRef.current;
    if (!start || !imageDimensions) return;
    setCropOffset(
      clampCropOffset(
        {
          x: start.offsetX + event.clientX - start.x,
          y: start.offsetY + event.clientY - start.y,
        },
        imageDimensions,
        zoom,
      ),
    );
  }

  function savePhoto() {
    const image = cropImageRef.current;
    if (!image || !imageDimensions) return;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) {
      toast.error("This photo could not be prepared on your device.");
      return;
    }
    const sourceSize = CROP_SIZE / displayScale;
    const imageLeft = (CROP_SIZE - imageDimensions.width * displayScale) / 2 + cropOffset.x;
    const imageTop = (CROP_SIZE - imageDimensions.height * displayScale) / 2 + cropOffset.y;
    const sourceX = Math.max(0, Math.min(imageDimensions.width - sourceSize, -imageLeft / displayScale));
    const sourceY = Math.max(0, Math.min(imageDimensions.height - sourceSize, -imageTop / displayScale));
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 512, 512);
    if (!saveProfileAvatar(canvas.toDataURL("image/jpeg", 0.86))) {
      toast.error("The photo could not be saved in this browser.");
      return;
    }
    toast.success("Profile photo updated.");
    closePhotoEditor();
  }

  const memberSince = new Date(`${profile.memberSince}-01-01T00:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" },
  );

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Account center
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
              Your profile
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              A clear overview of the identity and security settings linked to your BestCash account.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="live-dot" />
            Account services active
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
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 font-display text-2xl font-semibold text-primary shadow-inner">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={`${profile.fullName} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(profile.fullName)
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => setPhotoEditorOpen(true)}
                >
                  <Camera /> Edit photo
                </Button>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl font-semibold">{profile.fullName}</h3>
                  <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified profile" />
                </div>
                <p className="mt-1 text-sm text-white/65">
                  @{profile.username} · {profile.country}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
                    {profile.tier} member
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-white/75">
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-5 sm:min-w-[250px] sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Total engagement
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold">
                  {formatUSD(totalBalance, { compact: true })}
                </p>
                <p className="mt-1 text-xs text-emerald-300">Across {accounts.length} accounts</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Account status
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 font-display text-xl font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" /> Active
                </p>
                <p className="mt-1 text-xs text-white/55">No restrictions</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Identity
                </p>
                <h3 className="mt-1.5 text-lg font-semibold">Personal details</h3>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <LockKeyhole className="h-3 w-3 text-primary" /> Managed by BestCash
              </span>
            </div>
            <dl className="mt-3">
              <DetailRow icon={UserRound} label="Full name" value={profile.fullName} />
              <DetailRow icon={Mail} label="Email address" value={profile.email} />
              {profile.phone && <DetailRow icon={Smartphone} label="Phone number" value={profile.phone} />}
              <DetailRow icon={MapPin} label="Country of residence" value={profile.country} />
              {profile.nationality && (
                <DetailRow icon={Globe2} label="Nationality" value={profile.nationality} />
              )}
              {(profile.city || profile.state) && (
                <DetailRow
                  icon={MapPin}
                  label="City and state"
                  value={[profile.city, profile.state].filter(Boolean).join(", ")}
                />
              )}
              {profile.address && <DetailRow icon={MapPin} label="Address" value={profile.address} />}
              {profile.dateOfBirth && (
                <DetailRow icon={CalendarDays} label="Date of birth" value={profile.dateOfBirth} />
              )}
              {profile.gender && <DetailRow icon={UserRound} label="Gender" value={profile.gender} />}
              {profile.occupation && (
                <DetailRow icon={WalletCards} label="Occupation" value={profile.occupation} />
              )}
              <DetailRow
                icon={Globe2}
                label="Language"
                value={profile.language}
                detail="The language used across BestCash"
              />
              <DetailRow
                icon={WalletCards}
                label="Base currency"
                value={profile.currency}
                detail="Used for your primary account view"
              />
            </dl>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs leading-5 text-muted-foreground">
                Your personal details are protected and cannot be changed from this page. Contact
                support if your details need to be reviewed.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Security
                </p>
                <h3 className="mt-1.5 text-lg font-semibold">Security status</h3>
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
                      item.status === "Enabled"
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
                Login and transaction approvals are never shown here.
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
                <h3 className="text-sm font-semibold">Account history</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your relationship with BestCash began {profile.memberSince}.
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-4/5 rounded-full bg-[var(--gradient-gold)]" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Signature relationship · established account
            </p>
          </section>

          <section className="rounded-3xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <LifeBuoy className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">Need to change something?</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Our support team can help you review your account details.
                </p>
              </div>
            </div>
            <Link
              to="/support"
              className="mt-4 flex min-h-11 items-center justify-between rounded-2xl border border-border px-3.5 text-sm font-semibold transition-colors hover:border-primary/60 hover:bg-secondary/50"
            >
              Contact BestCash support
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </section>
        </div>

        <div className="flex items-start justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-semibold">Your account is protected</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                BestCash never asks for your login PIN or transaction PIN by email, message or phone.
              </p>
            </div>
          </div>
          <ArrowRight className="mt-0.5 hidden h-4 w-4 shrink-0 text-primary sm:block" />
        </div>
      </div>
      {photoEditorOpen && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={closePhotoEditor}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-editor-title"
            className="my-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") closePhotoEditor();
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 id="photo-editor-title" className="text-base font-semibold">
                  Update profile photo
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Square crop · saved on this device</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close photo editor"
                onClick={closePhotoEditor}
              >
                <X />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoSelection}
            />
            <div className="mt-5 flex flex-col items-center">
              {photoSource ? (
                <div
                  className="relative h-64 w-64 touch-none overflow-hidden rounded-2xl bg-secondary"
                  onPointerDown={handleCropPointerDown}
                  onPointerMove={handleCropPointerMove}
                  onPointerUp={() => {
                    dragStartRef.current = null;
                  }}
                  onPointerCancel={() => {
                    dragStartRef.current = null;
                  }}
                  aria-label="Photo crop area"
                >
                  <img
                    ref={cropImageRef}
                    src={photoSource}
                    alt="Photo crop preview"
                    draggable={false}
                    onLoad={(event) =>
                      setImageDimensions({
                        width: event.currentTarget.naturalWidth,
                        height: event.currentTarget.naturalHeight,
                      })
                    }
                    onError={() => toast.error("This image could not be opened.")}
                    className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none"
                    style={{
                      width: imageDimensions ? imageDimensions.width * displayScale : CROP_SIZE,
                      height: imageDimensions ? imageDimensions.height * displayScale : CROP_SIZE,
                      transform: `translate(-50%, -50%) translate(${cropOffset.x}px, ${cropOffset.y}px)`,
                    }}
                  />
                </div>
              ) : (
                <div className="grid h-64 w-64 place-items-center rounded-2xl border border-dashed border-border bg-secondary/50 text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
              {photoSource && (
                <div className="mt-4 w-64">
                  <label htmlFor="photo-zoom" className="mb-2 block text-xs font-medium">
                    Zoom
                  </label>
                  <input
                    id="photo-zoom"
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(event) => {
                      const nextZoom = Number(event.currentTarget.value);
                      setZoom(nextZoom);
                      if (imageDimensions) {
                        setCropOffset((current) => clampCropOffset(current, imageDimensions, nextZoom));
                      }
                    }}
                    className="w-full accent-primary"
                  />
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="outline" className="flex-1" onClick={closePhotoEditor}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus /> Choose photo
              </Button>
              <Button type="button" className="flex-1" disabled={!imageDimensions} onClick={savePhoto}>
                Save photo
              </Button>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}