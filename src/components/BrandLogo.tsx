import logo from "@/assets/bestcash-logo.jpg.asset.json";

export function BrandLogo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={logo.url}
        alt="BestCash logo"
        width={size}
        height={size}
        className="rounded-full ring-1 ring-border"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className="font-display text-lg font-semibold tracking-tight">
          <span className="gold-text">BestCash</span>
        </span>
      )}
    </div>
  );
}
