import { Nfc, Snowflake } from "lucide-react";
import logo from "@/assets/bestcash-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

export interface CardData {
  id: string;
  label: string;
  holder: string;
  number: string;
  expiry: string;
  network: string;
  frozen: boolean;
}

export function VirtualCard({ card, revealed }: { card: CardData; revealed?: boolean }) {
  const digits = card.number.replace(/\s/g, "");
  const groups = revealed
    ? [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 16)]
    : ["••••", "••••", "••••", digits.slice(12, 16)];

  return (
    <div
      className={cn(
        "relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl elev transition-all",
        card.frozen && "opacity-70 saturate-50",
      )}
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #f6f4f1 60%, #ece8e3 100%)" }}
    >
      {/* brand swoosh */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 105% 15%, rgba(240,120,20,0.95) 0%, rgba(250,175,40,0.85) 38%, rgba(255,255,255,0) 62%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-14 -left-10 h-40 w-[130%] rotate-[-8deg] rounded-[100%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(252,190,60,0.95) 0%, rgba(244,140,30,0.9) 55%, rgba(235,95,25,0.9) 100%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="h-7 w-9 rounded-[5px] bg-gradient-to-br from-[#e8c877] to-[#b7913f] ring-1 ring-black/10 sm:h-8 sm:w-11" />
          <img
            src={logo.url}
            alt=""
            className="h-11 w-11 rounded-full ring-1 ring-black/10 sm:h-14 sm:w-14"
          />
          <Nfc className="h-5 w-5 text-black/50" />
        </div>

        <div className="space-y-2">
          <div className="flex gap-3 font-display text-[15px] font-semibold tracking-[0.12em] text-black/80 sm:text-xl">
            {groups.map((g, i) => (
              <span key={i}>{g}</span>
            ))}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-black/45">Card holder</p>
              <p className="text-xs font-semibold text-black/80 sm:text-sm">{card.holder}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-black/45">Expires</p>
              <p className="text-xs font-semibold text-black/80 sm:text-sm">{card.expiry}</p>
            </div>
            <p className="font-display text-xs font-bold text-black/70 sm:text-sm">{card.network}</p>
          </div>
        </div>
      </div>

      {card.frozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/45 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
            <Snowflake className="h-3.5 w-3.5 text-primary" /> Frozen
          </span>
        </div>
      )}
    </div>
  );
}
