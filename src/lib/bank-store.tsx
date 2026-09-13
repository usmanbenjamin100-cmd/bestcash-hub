import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getDemoAccount,
  type Account,
  type Card,
  type CryptoHolding,
  type Notification,
  type Profile,
  type SavingsGoal,
  type SpendingCategory,
  type Transaction,
} from "@/data/bank";
import { useAuth } from "@/lib/auth-store";

interface BankState {
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  cryptoHoldings: CryptoHolding[];
  savingsGoals: SavingsGoal[];
  spendingByCategory: SpendingCategory[];
  notifications: Notification[];
  profile: Profile;
  totalBalance: number;
  transfer: (input: { recipient: string; amount: number; note?: string; from: string }) => void;
  toggleFreeze: (cardId: string) => void;
  setLimit: (cardId: string, limit: number) => void;
}

const BankContext = createContext<BankState | null>(null);

export function BankProvider({ children }: { children: ReactNode }) {
  const { accountUsername } = useAuth();
  const demoAccount = getDemoAccount(accountUsername);
  const [accounts, setAccounts] = useState<Account[]>(demoAccount.accounts);
  const [transactions, setTransactions] = useState<Transaction[]>(demoAccount.initialTransactions);
  const [cards, setCards] = useState<Card[]>(demoAccount.cards);
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>(demoAccount.cryptoHoldings);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(demoAccount.savingsGoals);
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingCategory[]>(
    demoAccount.spendingByCategory,
  );
  const [notifications, setNotifications] = useState<Notification[]>(demoAccount.notifications);
  const profile = demoAccount.profile;

  useEffect(() => {
    const nextAccount = getDemoAccount(accountUsername);
    setAccounts(nextAccount.accounts);
    setTransactions(nextAccount.initialTransactions);
    setCards(nextAccount.cards);
    setCryptoHoldings(nextAccount.cryptoHoldings);
    setSavingsGoals(nextAccount.savingsGoals);
    setSpendingByCategory(nextAccount.spendingByCategory);
    setNotifications(nextAccount.notifications);
  }, [accountUsername]);

  const value = useMemo<BankState>(() => {
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return {
      accounts,
      transactions,
      cards,
      cryptoHoldings,
      savingsGoals,
      spendingByCategory,
      notifications,
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
  }, [
    accounts,
    transactions,
    cards,
    cryptoHoldings,
    savingsGoals,
    spendingByCategory,
    notifications,
    profile,
  ]);

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within BankProvider");
  return ctx;
}