import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getAccountRecord,
  type AccountRecord,
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
  supportContacts: AccountRecord["supportContacts"];
  totalBalance: number;
  transfer: (input: { recipient: string; amount: number; note?: string; from: string }) => void;
  toggleFreeze: (cardId: string) => void;
  setLimit: (cardId: string, limit: number) => void;
}

const BankContext = createContext<BankState | null>(null);

export function BankProvider({ children }: { children: ReactNode }) {
  const { accountUsername } = useAuth();
  const accountRecord = getAccountRecord(accountUsername);
  const [accounts, setAccounts] = useState<Account[]>(accountRecord.accounts);
  const [transactions, setTransactions] = useState<Transaction[]>(
    accountRecord.initialTransactions,
  );
  const [cards, setCards] = useState<Card[]>(accountRecord.cards);
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>(
    accountRecord.cryptoHoldings,
  );
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(accountRecord.savingsGoals);
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingCategory[]>(
    accountRecord.spendingByCategory,
  );
  const [notifications, setNotifications] = useState<Notification[]>(accountRecord.notifications);
  const profile = accountRecord.profile;
  const supportContacts = accountRecord.supportContacts;

  useEffect(() => {
    const nextAccount = getAccountRecord(accountUsername);
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
      supportContacts,
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
    supportContacts,
  ]);

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within BankProvider");
  return ctx;
}
