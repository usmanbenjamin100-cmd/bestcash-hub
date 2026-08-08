import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { notifications as seed } from "@/data/bank";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — BestCash Demo Banking" },
      {
        name: "description",
        content:
          "Demo alerts for payments, deposits and security tips in the BestCash banking prototype.",
      },
      { property: "og:title", content: "Notifications — BestCash Demo Banking" },
      {
        property: "og:description",
        content: "Payment, deposit and security alerts in the demo app.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(seed);

  return (
    <AppShell title="Notifications">
      <div className="mx-auto max-w-2xl space-y-4">
        <button
          onClick={() => setItems((p) => p.map((n) => ({ ...n, unread: false })))}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <CheckCheck className="h-4 w-4" /> Mark all as read
        </button>
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((n) => (
            <li
              key={n.id}
              onClick={() =>
                setItems((p) =>
                  p.map((item) => (item.id === n.id ? { ...item, unread: false } : item)),
                )
              }
              className="flex cursor-pointer gap-3 p-4 transition-colors hover:bg-secondary/40"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full",
                  n.unread ? "gold-surface" : "bg-secondary text-muted-foreground",
                )}
              >
                <Bell className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
              </div>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
