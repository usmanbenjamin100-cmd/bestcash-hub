export type TxCategory =
  "transfer" | "shopping" | "food" | "bills" | "salary" | "crypto" | "travel";

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

export interface Profile {
  fullName: string;
  username: string;
  email: string;
  country: string;
  currency: string;
  language: string;
  memberSince: string;
  tier: string;
  avatar?: string;
  dateOfBirth?: string;
  phone?: string;
  state?: string;
  city?: string;
  gender?: string;
  occupation?: string;
  address?: string;
}

export const profile: Profile = {
  fullName: "Mats Johansson",
  username: "johansson5",
  email: "mats@bestcash.com",
  country: "Sverige",
  currency: "SEK — Svenska kronor",
  language: "Svenska",
  memberSince: "2021",
  tier: "Signature",
};

export const accountCredentials = {
  username: "johansson5",
  loginPin: "Mats0@1",
  transactionPin: "2236",
};

export const accounts: Account[] = [
  {
    id: "acc-1",
    name: "Everyday Checking",
    type: "Checking",
    number: "0000 1111",
    balance: 31951604.16,
  },
  { id: "acc-2", name: "Growth Savings", type: "Savings", number: "0000 2222", balance: 31951604.16 },
  {
    id: "acc-3",
    name: "Index Portfolio",
    type: "Investment",
    number: "0000 3333",
    balance: 15975802.08,
  },
];

export const initialTransactions: Transaction[] = [
  {
    id: "t1",
    title: "Salary — Northwind AB",
    counterparty: "Northwind AB",
    amount: 65100.0,
    date: "2026-08-01T09:12:00Z",
    category: "salary",
    status: "completed",
  },
  {
    id: "t2",
    title: "Grocery run",
    counterparty: "Hemköp",
    amount: -885.36,
    date: "2026-08-02T18:40:00Z",
    category: "food",
    status: "completed",
  },
  {
    id: "t3",
    title: "Transfer to Emma L.",
    counterparty: "Emma Lindqvist",
    amount: -4725.0,
    date: "2026-08-03T11:05:00Z",
    category: "transfer",
    status: "completed",
  },
  {
    id: "t4",
    title: "Electricity bill",
    counterparty: "Vattenfall",
    amount: -1395.45,
    date: "2026-08-03T08:00:00Z",
    category: "bills",
    status: "completed",
  },
  {
    id: "t5",
    title: "BTC purchase",
    counterparty: "BestCash Crypto",
    amount: -10500.0,
    date: "2026-08-04T14:22:00Z",
    category: "crypto",
    status: "completed",
  },
  {
    id: "t6",
    title: "Flight to Oslo",
    counterparty: "SAS",
    amount: -3343.2,
    date: "2026-08-05T07:31:00Z",
    category: "travel",
    status: "pending",
  },
  {
    id: "t7",
    title: "Headphones",
    counterparty: "Elgiganten",
    amount: -2414.89,
    date: "2026-08-06T16:10:00Z",
    category: "shopping",
    status: "completed",
  },
  {
    id: "t8",
    title: "Refund — Zalando",
    counterparty: "Zalando",
    amount: 782.25,
    date: "2026-08-06T19:45:00Z",
    category: "shopping",
    status: "completed",
  },
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
    holder: "MATS JOHANSSON",
    number: "4827 9134 2608 7417",
    expiry: "04/28",
    network: "BestCash Pay",
    frozen: false,
    limit: 52500.0,
    spent: 14916.3,
    physical: true,
  },
  {
    id: "c2",
    label: "Virtual Shopping",
    holder: "MATS JOHANSSON",
    number: "5391 6048 2175 3086",
    expiry: "09/29",
    network: "BestCash Pay",
    frozen: false,
    limit: 15750.0,
    spent: 3257.62,
    physical: false,
  },
];

export type Card = (typeof cards)[number];

export const cryptoHoldings = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.184,
    price: 643020.0,
    change: 2.4,
    volume: 28.4,
    marketCap: 1208,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 2.35,
    price: 34860.0,
    change: -1.1,
    volume: 14.7,
    marketCap: 398,
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 18.4,
    price: 1554.0,
    change: 4.8,
    volume: 3.1,
    marketCap: 68,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: 1200,
    price: 10.5,
    change: 0.0,
    volume: 6.8,
    marketCap: 32,
  },
];

export const savingsGoals = [
  { id: "g1", name: "Emergency fund", target: 210000.0, saved: 149100.0 },
  { id: "g2", name: "Lofoten trip", target: 42000.0, saved: 17325.0 },
  { id: "g3", name: "New studio gear", target: 31500.0, saved: 25200.0 },
];

export const spendingByCategory = [
  { category: "Food", value: 6510.0 },
  { category: "Bills", value: 5040.0 },
  { category: "Shopping", value: 9555.0 },
  { category: "Travel", value: 3570.0 },
  { category: "Other", value: 2625.0 },
];

export const notifications = [
  {
    id: "n1",
    title: "Card payment approved",
    body: "Elgiganten · 2 414,89 kr",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Salary received",
    body: "Northwind AB · 65 100,00 kr",
    time: "1d ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Security tip",
    body: "Keep your account details secure and review every transaction carefully.",
    time: "3d ago",
    unread: false,
  },
];

export interface DemoAccount {
  credentials: {
    username: string;
    loginPin: string;
    transactionPin: string;
  };
  profile: Profile;
  accounts: Account[];
  initialTransactions: Transaction[];
  cards: Card[];
}

export const demoAccounts: DemoAccount[] = [
  { credentials: accountCredentials, profile, accounts, initialTransactions, cards },
  {
    credentials: {
      username: "soniadembo23",
      loginPin: "2000",
      transactionPin: "2000",
    },
    profile: {
      fullName: "William Moses Thomas",
      username: "soniadembo23",
      email: "soniademboacc@gmail.com",
      country: "USA",
      currency: "USD — US dollars",
      language: "English",
      memberSince: "2026",
      tier: "Signature",
      dateOfBirth: "12/02/1950",
      phone: "+12105437173",
      state: "Kentucky",
      city: "Louisville",
      gender: "Male",
      occupation: "Construction management",
      address: "7310 Vaughn Mill Rd, Louisville, KY",
    },
    accounts: [
      {
        id: "william-checking",
        name: "Available balance",
        type: "Checking",
        number: "0000 1000",
        balance: 1000,
      },
    ],
    initialTransactions: [],
    cards: [
      {
        id: "william-card",
        label: "BestCash Classic",
        holder: "WILLIAM MOSES THOMAS",
        number: "4827 9134 2608 7417",
        expiry: "09/30",
        network: "BestCash Pay",
        frozen: false,
        limit: 1000,
        spent: 0,
        physical: true,
      },
    ],
  },
];

export function getDemoAccount(username?: string | null) {
  return demoAccounts.find((account) => account.credentials.username === username) ?? demoAccounts[0]!;
}