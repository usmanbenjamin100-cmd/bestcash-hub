// Fictional demo data for the BestCash prototype. No real accounts or credentials.

export type TxCategory =
  | "transfer"
  | "shopping"
  | "food"
  | "bills"
  | "salary"
  | "crypto"
  | "travel";

export interface Transaction {
  id: string;
  title: string;
  counterparty: string;
  amount: number; // negative = outflow
  date: string;
  category: TxCategory;
  status: "completed" | "pending";
}

export interface Account {
  id: string;
  name: string;
  type: "Checking" | "Savings" | "Investment";
  number: string;
  balance: number;
}

export interface Recipient {
  id: string;
  name: string;
  bank: string;
  account: string;
  initials: string;
}

export const profile = {
  fullName: "Alex Demo",
  username: "demo_user",
  email: "alex@bestcash.demo",
  country: "Sweden",
  currency: "USD",
  memberSince: "2021",
  tier: "Signature",
};

export const accounts: Account[] = [
  { id: "acc-1", name: "Everyday Checking", type: "Checking", number: "0000 1111", balance: 18420.55 },
  { id: "acc-2", name: "Growth Savings", type: "Savings", number: "0000 2222", balance: 42350.0 },
  { id: "acc-3", name: "Index Portfolio", type: "Investment", number: "0000 3333", balance: 15870.2 },
];

export const initialTransactions: Transaction[] = [
  { id: "t1", title: "Salary — Northwind AB", counterparty: "Northwind AB", amount: 6200, date: "2026-08-01T09:12:00Z", category: "salary", status: "completed" },
  { id: "t2", title: "Grocery run", counterparty: "Hemköp", amount: -84.32, date: "2026-08-02T18:40:00Z", category: "food", status: "completed" },
  { id: "t3", title: "Transfer to Emma L.", counterparty: "Emma Lindqvist", amount: -450, date: "2026-08-03T11:05:00Z", category: "transfer", status: "completed" },
  { id: "t4", title: "Electricity bill", counterparty: "Vattenfall", amount: -132.9, date: "2026-08-03T08:00:00Z", category: "bills", status: "completed" },
  { id: "t5", title: "BTC purchase", counterparty: "BestCash Crypto", amount: -1000, date: "2026-08-04T14:22:00Z", category: "crypto", status: "completed" },
  { id: "t6", title: "Flight to Oslo", counterparty: "SAS", amount: -318.4, date: "2026-08-05T07:31:00Z", category: "travel", status: "pending" },
  { id: "t7", title: "Headphones", counterparty: "Elgiganten", amount: -229.99, date: "2026-08-06T16:10:00Z", category: "shopping", status: "completed" },
  { id: "t8", title: "Refund — Zalando", counterparty: "Zalando", amount: 74.5, date: "2026-08-06T19:45:00Z", category: "shopping", status: "completed" },
];

export const recipients: Recipient[] = [
  { id: "r1", name: "Emma Lindqvist", bank: "Nordea", account: "•••• 4821", initials: "EL" },
  { id: "r2", name: "Jonas Berg", bank: "SEB", account: "•••• 9074", initials: "JB" },
  { id: "r3", name: "Sara Holm", bank: "Swedbank", account: "•••• 3312", initials: "SH" },
  { id: "r4", name: "Studio Nord AB", bank: "Handelsbanken", account: "•••• 7765", initials: "SN" },
];

export const cards = [
  {
    id: "c1",
    label: "BestCash Classic",
    holder: "ALEX DEMO",
    number: "0000 0000 0000 0000",
    expiry: "04/28",
    network: "BestCash Pay",
    frozen: false,
    limit: 5000,
    spent: 1420.6,
    physical: true,
  },
  {
    id: "c2",
    label: "Virtual Shopping",
    holder: "ALEX DEMO",
    number: "0000 0000 0000 0001",
    expiry: "09/29",
    network: "BestCash Pay",
    frozen: false,
    limit: 1500,
    spent: 310.25,
    physical: false,
  },
];

export const cryptoHoldings = [
  { symbol: "BTC", name: "Bitcoin", amount: 0.184, price: 61240, change: 2.4 },
  { symbol: "ETH", name: "Ethereum", amount: 2.35, price: 3320, change: -1.1 },
  { symbol: "SOL", name: "Solana", amount: 18.4, price: 148, change: 4.8 },
  { symbol: "USDC", name: "USD Coin", amount: 1200, price: 1, change: 0.0 },
];

export const savingsGoals = [
  { id: "g1", name: "Emergency fund", target: 20000, saved: 14200 },
  { id: "g2", name: "Lofoten trip", target: 4000, saved: 1650 },
  { id: "g3", name: "New studio gear", target: 3000, saved: 2400 },
];

export const spendingByCategory = [
  { category: "Food", value: 620 },
  { category: "Bills", value: 480 },
  { category: "Shopping", value: 910 },
  { category: "Travel", value: 340 },
  { category: "Other", value: 250 },
];

export const notifications = [
  { id: "n1", title: "Card payment approved", body: "Elgiganten · $229.99", time: "2h ago", unread: true },
  { id: "n2", title: "Salary received", body: "Northwind AB · $6,200.00", time: "1d ago", unread: true },
  { id: "n3", title: "Security tip", body: "This is a demo app — never enter real bank details.", time: "3d ago", unread: false },
];
