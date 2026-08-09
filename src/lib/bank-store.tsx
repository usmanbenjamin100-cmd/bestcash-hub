import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  accounts as seedAccounts,
  initialTransactions,
  cards as seedCards,
  profile as seedProfile,
  type Account,
  type Profile,
  type Transaction,
} from "@/data/bank";

type Card = (typeof seedCards)[number];

interface BankState {
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  profile: Profile;
  totalBalance: number;
  transfer: (input: { recipient: string; amount: number; note?: string; from: string }) => void;
  toggleFreeze: (cardId: string) => void;
  setLimit: (cardId: string, limit: number) => void;
}

const BankContext = createContext<BankState | null>(null);

export function BankProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [cards, setCards] = useState<Card[]>(seedCards);
  const profile = seedProfile;

  const value = useMemo<BankState>(() => {
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return {
      accounts,
      transactions,
      cards,
      profile,
      totalBalance,
      transfer: ({ recipient, amount, note, from }) => {
        setAccounts((prev) =>
          prev.map((a) => (a.id === from ? { ...a, balance: a.balance - amount } : a)),
        );
        setTransactions((prev) => [
          {
            id: `t-${Date.now()}`,
            title: note?.trim() ? note.trim() : `Transfer to ${recipient}`,
            counterparty: recipient,
            amount: -amount,
            date: new Date().toISOString(),
            category: "transfer",
            status: "completed",
          },
          ...prev,
        ]);
      },
      toggleFreeze: (cardId) =>
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c))),
      setLimit: (cardId, limit) =>
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, limit } : c))),
    };
  }, [accounts, transactions, cards, profile]);

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within BankProvider");
  return ctx;
}
