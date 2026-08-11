import { useEffect, useMemo, useState } from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import {
  ArrowDownLeft, ArrowUpRight, Bell, Bitcoin, CalendarDays, Check, ChevronRight,
  CircleHelp, CreditCard, Eye, EyeOff, FileText, Filter, Home, Landmark, LockKeyhole,
  Menu, MoreHorizontal, RefreshCw, Search, Send, Settings, ShieldCheck, Sparkles,
  TrendingUp, UserRound, WalletCards, X, Zap,
} from 'lucide-react';

type Transaction = { id: string; merchant: string; amount: number; date: string; category: string; status: 'Completed' | 'Pending'; direction?: 'in' | 'out' };
type CardData = { id: string; type: 'Virtual' | 'Physical'; lastFour: string; status: 'Active' | 'Frozen'; spendingLimit: number; spent: number; };
type Goal = { id: string; name: string; target: number; saved: number; };
type Notification = { id: string; title: string; detail: string; date: string; read: boolean; };
type Language = 'sv' | 'en';
type Profile = { name: string; username: string; address: string; currency: string; emailAlerts: boolean; biometric: boolean; language: Language; };

const initialTransactions: Transaction[] = [
  { id: 't1', merchant: 'Coop Forum', amount: -684.5, date: 'Today, 13:42', category: 'Groceries', status: 'Completed', direction: 'out' },
  { id: 't2', merchant: 'Salary · Nordbyte AB', amount: 32400, date: '21 Oct 2024', category: 'Income', status: 'Completed', direction: 'in' },
  { id: 't3', merchant: 'Voi Technology', amount: -129, date: '20 Oct 2024', category: 'Transport', status: 'Completed', direction: 'out' },
  { id: 't4', merchant: 'Spotify AB', amount: -119, date: '19 Oct 2024', category: 'Entertainment', status: 'Completed', direction: 'out' },
  { id: 't5', merchant: 'Hemköp', amount: -342.8, date: '18 Oct 2024', category: 'Groceries', status: 'Pending', direction: 'out' },
  { id: 't6', merchant: 'Figma', amount: -155, date: '17 Oct 2024', category: 'Subscriptions', status: 'Completed', direction: 'out' },
  { id: 't7', merchant: 'Insurance refund', amount: 920, date: '15 Oct 2024', category: 'Income', status: 'Completed', direction: 'in' },
];
const initialCards: CardData[] = [
  { id: 'c1', type: 'Physical', lastFour: '4821', status: 'Active', spendingLimit: 18000, spent: 6274.5 },
  { id: 'c2', type: 'Virtual', lastFour: '9038', status: 'Active', spendingLimit: 5000, spent: 1290 },
];
const initialGoals: Goal[] = [
  { id: 'g1', name: 'Japan, spring 2025', target: 28000, saved: 17400 },
  { id: 'g2', name: 'Rainy day reserve', target: 60000, saved: 32900 },
  { id: 'g3', name: 'New camera', target: 14500, saved: 10200 },
];
const initialNotifications: Notification[] = [
  { id: 'n1', title: 'Your salary has arrived', detail: '3,240.00 SEK was added to your everyday account.', date: 'Today, 09:12', read: false },
  { id: 'n2', title: 'New sign-in confirmed', detail: 'A sign-in from Stockholm on Safari was confirmed.', date: 'Yesterday, 18:44', read: false },
  { id: 'n3', title: 'Weekly money note', detail: 'You spent 12% less on transport than last week.', date: '20 Oct 2024', read: true },
  { id: 'n4', title: 'Card payment completed', detail: 'Coop Forum · 684.50 SEK', date: 'Today, 13:42', read: true },
];
const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/transfers', label: 'Transfers', icon: ArrowUpRight },
  { href: '/cards', label: 'Cards', icon: CreditCard },
  { href: '/history', label: 'Transaction history', icon: FileText },
  { href: '/crypto', label: 'Crypto', icon: Bitcoin },
];
const copy = {
  en: {
    nav: ['Overview', 'Transfers', 'Cards', 'Transaction history', 'Crypto'],
    pageNames: { '/': 'Overview', '/transfers': 'Transfers', '/cards': 'Cards', '/history': 'Transaction history', '/crypto': 'Crypto', '/profile': 'Profile & preferences', '/notifications': 'Notifications' },
    profile: 'Profile',
    personalDetails: 'Personal details',
    securityAlerts: 'Security & alerts',
    language: 'Language',
    languageHint: 'Choose the language used across BestCash.',
    english: 'English',
    swedish: 'Svenska',
    preferenceSaved: 'Preference saved',
  },
  sv: {
    nav: ['Översikt', 'Överföringar', 'Kort', 'Transaktionshistorik', 'Krypto'],
    pageNames: { '/': 'Översikt', '/transfers': 'Överföringar', '/cards': 'Kort', '/history': 'Transaktionshistorik', '/crypto': 'Krypto', '/profile': 'Profil och inställningar', '/notifications': 'Aviseringar' },
    profile: 'Profil',
    personalDetails: 'Personuppgifter',
    securityAlerts: 'Säkerhet och aviseringar',
    language: 'Språk',
    languageHint: 'Välj språket som används i BestCash.',
    english: 'English',
    swedish: 'Svenska',
    preferenceSaved: 'Inställningen har sparats',
  },
} as const;
const formatMoney = (value: number) => `${value < 0 ? '−' : ''}${Math.abs(value).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK`;
const shortMoney = (value: number) => `${value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`;

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) as T : initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

function Logo() {
  return <div className="brand"><div className="brand-mark" /><div className="brand-name">best<span>cash</span></div></div>;
}

function Shell({ children, unread, language }: { children: React.ReactNode; unread: number; language: Language }) {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const current = location === '/' ? '/' : `/${location.split('/')[1]}`;
  const mobileItems = navItems.slice(0, 4);
  const labels = copy[language];
  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <div className="eyebrow">{language === 'sv' ? 'Dina pengar i balans' : 'Your money, in balance'}</div>
      <nav className="nav">{navItems.map(({ href, icon: Icon }, index) => <Link key={href} href={href} className={`nav-item ${current === href ? 'active' : ''}`} data-testid={`link-${navItems[index].label.toLowerCase().replaceAll(' ', '-')}`}><Icon />{labels.nav[index]}</Link>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="eyebrow" style={{ padding: 0, color: 'hsl(164 45% 59%)' }}>{language === 'sv' ? 'Behöver du hjälp?' : 'Need a hand?'}</div><p>{language === 'sv' ? 'Vårt supportteam finns här när dina planer ändras.' : 'Our support team is here when your plans change.'}</p><button className="help-link" onClick={() => setLocation('/profile')} data-testid="button-contact-support">{language === 'sv' ? 'Kontakta support' : 'Contact support'} <ChevronRight size={13} /></button></div>
        <Link href="/profile" className="profile-chip" data-testid="link-profile-sidebar"><div className="avatar">MJ</div><div><strong>Mats Johansson</strong><span>{language === 'sv' ? 'Privatkonto' : 'Personal account'}</span></div><MoreHorizontal size={16} color="hsl(205 10% 65%)" /></Link>
      </div>
    </aside>
    <div className="main">
      <header className="mobile-header"><Logo /><div className="mobile-menu">{mobileItems.map(({ href, icon: Icon }) => <Link key={href} href={href} className={current === href ? 'active' : ''} data-testid={`mobile-nav-${href === '/' ? 'home' : href.slice(1)}`}><Icon size={16} /></Link>)}</div></header>
      <header className="topbar"><div className="breadcrumb"><span>BestCash</span><ChevronRight size={13} /><strong>{pageName(location, language)}</strong></div><div className="top-actions"><Link href="/history" className="icon-button" aria-label={language === 'sv' ? 'Sök transaktioner' : 'Search transactions'} data-testid="link-search"><Search size={16} /></Link><Link href="/notifications" className="icon-button" aria-label={language === 'sv' ? 'Aviseringar' : 'Notifications'} data-testid="link-notifications"><Bell size={16} />{unread > 0 && <span className="notification-dot" />}</Link><Link href="/profile" className="icon-button" aria-label={language === 'sv' ? 'Profilinställningar' : 'Profile settings'} data-testid="link-settings"><Settings size={16} /></Link></div></header>
      {children}
    </div>
  </div>;
}

function pageName(path: string, language: Language) {
  return copy[language].pageNames[path as keyof typeof copy.en.pageNames] || copy[language].pageNames['/'];
}

function Intro({ kicker, title, detail, action }: { kicker: string; title: string; detail: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{detail}</p></div><div>{action || <span className="date-note">UPDATED JUST NOW · 21 OCT 2024</span>}</div></div>;
}

function Dashboard({ transactions, goals, visible, setVisible, onToast }: { transactions: Transaction[]; goals: Goal[]; visible: boolean; setVisible: (v: boolean) => void; onToast: (s: string) => void }) {
  const [, setLocation] = useLocation();
  return <main className="content fade-in">
    <Intro kicker="Monday, 21 October 2024" title="Good morning, Mats." detail="Here’s your financial picture, without the noise." action={<span className="date-note">LAST SYNC · 2 MIN AGO</span>} />
    <div className="grid dashboard-grid">
      <section className="card balance-card" data-testid="card-total-balance"><div className="eyebrow">Total balance · SEK</div><div className="balance-amount" data-testid="text-total-balance">{visible ? '84 265,40' : '•• •••,••'}<span>kr</span></div><div className="balance-footer"><div className="balance-meta"><div><small>Available to spend</small><strong>{visible ? '42 791,20' : '•• •••'} kr</strong></div><div><small>Savings</small><strong>{visible ? '41 474,20' : '•• •••'} kr</strong></div></div><button className="ghost-button" onClick={() => setVisible(!visible)} data-testid="button-toggle-balance">{visible ? <EyeOff size={14} /> : <Eye size={14} />}{visible ? 'Hide balance' : 'Show balance'}</button></div></section>
      <section className="card card-pad cashflow-card"><div className="section-head"><div><h2>Cash flow</h2><div className="cashflow-total">+12 846 kr</div><div className="cashflow-sub">Income minus spending · October</div></div><button onClick={() => setLocation('/history')} data-testid="button-cashflow-details">Details <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button></div><div className="chart">{[38, 55, 42, 64, 48, 69, 51, 77, 58, 71, 63, 87].map((height, i) => <div key={i} className={`bar ${i === 11 ? 'current' : ''}`} style={{ height: `${height}%` }} />)}</div><div className="chart-labels"><span>01 Oct</span><span>08</span><span>15</span><span>21 Oct</span></div></section>
      <div className="quick-grid">{[{ icon: Send, label: 'Send money', sub: 'To a person or account', href: '/transfers' }, { icon: CreditCard, label: 'Manage cards', sub: 'Freeze or set limits', href: '/cards' }, { icon: TrendingUp, label: 'Explore crypto', sub: 'Markets & holdings', href: '/crypto' }, { icon: FileText, label: 'All activity', sub: 'Your complete history', href: '/history' }].map(({ icon: Icon, label, sub, href }) => <Link href={href} className="quick-action" key={href} data-testid={`link-quick-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="quick-icon"><Icon size={16} /></div><div><strong>{label}</strong><span>{sub}</span></div><ChevronRight size={14} style={{ marginLeft: 'auto', color: 'hsl(var(--muted-foreground))' }} /></Link>)}</div>
    </div>
    <div className="grid lower-grid">
      <section className="card card-pad"><div className="section-head"><h2>Recent activity</h2><button onClick={() => setLocation('/history')} data-testid="button-view-all-transactions">View all <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button></div>{transactions.slice(0, 4).map(t => <TransactionRow key={t.id} transaction={t} />)}</section>
      <section className="card card-pad"><div className="section-head"><h2>Your savings</h2><button onClick={() => onToast('Savings goals are ready for you')} data-testid="button-savings-info">Manage <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button></div>{goals.map(g => <div className="goal" key={g.id}><div className="goal-line"><strong>{g.name}</strong><span>{Math.round(g.saved / g.target * 100)}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${g.saved / g.target * 100}%` }} /></div><div className="goal-line" style={{ margin: '7px 0 0' }}><span>{shortMoney(g.saved)} saved</span><span>of {shortMoney(g.target)}</span></div></div>)}</section>
    </div>
  </main>;
}

function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  const initials = t.merchant.split(' ').map(w => w[0]).slice(0, 2).join('');
  return <div className="transaction-row" data-testid={`row-transaction-${t.id}`}><div className="merchant-icon">{initials}</div><div className="transaction-copy"><strong>{t.merchant}</strong><span>{t.category} · {t.date}</span></div><div className={`transaction-amount ${t.amount > 0 ? 'positive' : ''}`}>{t.amount > 0 ? '+' : ''}{formatMoney(t.amount)}<small>{t.status}</small></div></div>;
}

function Transfers({ transactions, setTransactions, onToast }: { transactions: Transaction[]; setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>; onToast: (s: string) => void }) {
  const [recipient, setRecipient] = useState(''); const [amount, setAmount] = useState(''); const [note, setNote] = useState('');
  const recipients = [{ name: 'Anna Johansson', detail: 'SE45 5000 · · · · 1842', initials: 'AJ' }, { name: 'Leo Andersson', detail: 'SE21 6000 · · · · 9031', initials: 'LA' }, { name: 'Own savings', detail: 'BestCash savings · · · 2290', initials: 'OS' }];
  const send = () => { const numeric = Number(amount.replace(',', '.')); if (!recipient || !numeric || numeric <= 0) { onToast('Choose a recipient and enter an amount'); return; } setTransactions(prev => [{ id: `t-${Date.now()}`, merchant: recipient, amount: -numeric, date: 'Just now', category: 'Transfer', status: 'Pending', direction: 'out' }, ...prev]); setAmount(''); setNote(''); onToast(`Transfer to ${recipient} is being reviewed`); };
  return <main className="content fade-in"><Intro kicker="Everyday banking" title="Move money simply." detail="Send a transfer now or return to someone you trust." action={<button className="secondary-button" onClick={() => onToast('Transfers are protected by BestCash security')} data-testid="button-transfer-security"><ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Protected transfers</button>} /><div className="grid panel-grid"><section className="card card-pad transfer-card"><div className="section-head"><h2>New transfer</h2><span className="date-note">SEPA · SEK</span></div><div className="transfer-layout"><div><div className="form-group"><label htmlFor="recipient">Recipient</label><input id="recipient" className="input" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Name or account number" data-testid="input-transfer-recipient" /></div><div className="form-group"><label htmlFor="amount">Amount</label><div className="amount-input"><input id="amount" inputMode="decimal" className="input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" data-testid="input-transfer-amount" /><span className="currency-mark">SEK</span></div><div className="form-help">Available balance · 42 791,20 SEK</div></div><div className="form-group"><label htmlFor="note">Message <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 400 }}>· optional</span></label><input id="note" className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="What’s this for?" data-testid="input-transfer-note" /></div><div className="form-actions"><button className="primary-button" onClick={send} data-testid="button-send-transfer"><Send size={14} /> Review transfer</button><button className="secondary-button" onClick={() => { setRecipient(''); setAmount(''); setNote(''); }} data-testid="button-clear-transfer">Clear</button></div></div><div><div className="eyebrow" style={{ marginBottom: 12 }}>Recent recipients</div>{recipients.map(r => <div className="recipient" key={r.name}><div className="avatar">{r.initials}</div><div className="recipient-copy"><strong>{r.name}</strong><span>{r.detail}</span></div><button className="recipient-use" onClick={() => setRecipient(r.name)} data-testid={`button-recipient-${r.initials}`}>Use</button></div>)}</div></div></section><aside className="card card-pad"><div className="section-head"><h2>Transfer activity</h2><RefreshCw size={14} color="hsl(var(--muted-foreground))" /></div>{transactions.filter(t => t.category === 'Transfer').slice(0, 3).map(t => <TransactionRow key={t.id} transaction={t} />)}{transactions.filter(t => t.category === 'Transfer').length === 0 && <div className="empty">Your outgoing transfers will appear here.</div>}</aside></div></main>;
}

function Cards({ cards, setCards, onToast }: { cards: CardData[]; setCards: React.Dispatch<React.SetStateAction<CardData[]>>; onToast: (s: string) => void }) {
  const toggle = (id: string) => { setCards(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Frozen' : 'Active' } : c)); const card = cards.find(c => c.id === id); onToast(`${card?.type} card ${card?.status === 'Active' ? 'frozen' : 'unfrozen'}`); };
  return <main className="content fade-in"><Intro kicker="Cards & spending" title="Cards that stay in your control." detail="Manage your cards, limits, and security in one quiet place." action={<button className="primary-button" onClick={() => onToast('New card request started')} data-testid="button-new-card"><CreditCard size={14} /> Request a card</button>} /><div className="cards-showcase">{cards.map(c => <section className="card card-pad" key={c.id} data-testid={`card-${c.id}`}><div className={`bank-card ${c.type === 'Virtual' ? 'virtual' : ''}`}><div className="bank-card-top"><strong>bestcash</strong><div className="card-chip" /></div><div className="card-status">{c.status}</div><div className="card-number">••••  ••••  ••••  {c.lastFour}</div><div className="card-bottom"><span>MATS JOHANSSON</span><span>{c.type.toUpperCase()}</span></div></div><div className="card-details"><div className="detail-box"><small>Monthly spend</small><strong>{shortMoney(c.spent)}</strong></div><div className="detail-box"><small>Spending limit</small><strong>{shortMoney(c.spendingLimit)}</strong></div></div><button className={`secondary-button ${c.status === 'Frozen' ? 'frozen-action' : ''}`} style={{ marginTop: 14, width: '100%' }} onClick={() => toggle(c.id)} data-testid={`button-toggle-card-${c.id}`}>{c.status === 'Active' ? <><LockKeyhole size={14} /> Freeze card</> : <><Check size={14} /> Unfreeze card</>}</button></section>)}</div><section className="card card-pad" style={{ marginTop: 18 }}><div className="section-head"><h2>Card controls</h2><span className="date-note">APPLY TO ALL CARDS</span></div><ul className="settings-list"><li className="settings-item"><div className="settings-icon"><Zap size={16} /></div><div className="settings-copy"><strong>Tap to pay</strong><span>Allow contactless payments at checkout</span></div><button className="switch on" onClick={() => onToast('Tap to pay preference updated')} aria-label="Toggle tap to pay" data-testid="switch-tap-to-pay"><span /></button></li><li className="settings-item"><div className="settings-icon"><ArrowUpRight size={16} /></div><div className="settings-copy"><strong>Online purchases</strong><span>Use your cards safely on the web</span></div><button className="switch on" onClick={() => onToast('Online purchases preference updated')} aria-label="Toggle online purchases" data-testid="switch-online-purchases"><span /></button></li></ul></section></main>;
}

function History({ transactions }: { transactions: Transaction[] }) {
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('All categories');
  const filtered = useMemo(() => transactions.filter(t => `${t.merchant} ${t.category}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All categories' || t.category === category)), [transactions, query, category]);
  return <main className="content fade-in"><Intro kicker="Your complete record" title="Transaction history." detail="Every payment, transfer, and deposit — clearly accounted for." action={<button className="secondary-button" onClick={() => { setQuery(''); setCategory('All categories'); }} data-testid="button-reset-history"><RefreshCw size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Reset filters</button>} /><section className="card card-pad"><div className="toolbar"><div className="input-wrap"><Search size={15} /><input className="input" type="search" placeholder="Search by merchant or category" value={query} onChange={e => setQuery(e.target.value)} data-testid="input-search-transactions" /></div><select className="select" value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter transaction category" data-testid="select-transaction-category"><option>All categories</option>{['Groceries', 'Income', 'Transport', 'Entertainment', 'Subscriptions', 'Transfer'].map(c => <option key={c}>{c}</option>)}</select><button className="secondary-button" onClick={() => setCategory('All categories')} data-testid="button-filter-transactions"><Filter size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Filter</button></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Merchant</th><th>Category</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead><tbody>{filtered.map(t => <tr key={t.id} data-testid={`row-history-${t.id}`}><td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="merchant-icon">{t.merchant.split(' ').map(w => w[0]).slice(0, 2).join('')}</div><strong>{t.merchant}</strong></div></td><td style={{ color: 'hsl(var(--muted-foreground))' }}>{t.category}</td><td style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>{t.date}</td><td><span className={`status ${t.status === 'Pending' ? 'pending' : 'success'}`}>{t.status}</span></td><td className={`money ${t.amount > 0 ? 'positive-text' : ''}`}>{t.amount > 0 ? '+' : ''}{formatMoney(t.amount)}</td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty"><FileText size={20} style={{ marginBottom: 8 }} />No transactions match your search.</div>}</div></section></main>;
}

function Crypto() {
  const markets = [{ name: 'Bitcoin', ticker: 'BTC', price: '1 012 840', change: '+3.84%' }, { name: 'Ethereum', ticker: 'ETH', price: '25 840', change: '+1.62%' }, { name: 'Solana', ticker: 'SOL', price: '1 480', change: '−0.48%' }];
  return <main className="content fade-in"><Intro kicker="A considered view of digital assets" title="Crypto, without the noise." detail="A small, clear window into your digital holdings." action={<button className="secondary-button" onClick={() => window.alert('Market prices are refreshed for this demo.')} data-testid="button-refresh-markets"><RefreshCw size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Refresh prices</button>} /><div className="grid panel-grid"><section className="card crypto-hero"><div className="eyebrow" style={{ color: 'hsl(18 58% 73%)' }}>Your crypto balance · SEK</div><div className="crypto-value">12 486,20 kr</div><p>+1 246,80 kr this month. Your holdings are a small part of your wider plan.</p><div style={{ position: 'absolute', bottom: 25, zIndex: 1, display: 'flex', gap: 25 }}><div><div className="eyebrow" style={{ color: 'hsl(205 12% 72%)' }}>BTC</div><div className="money" style={{ fontSize: 12, marginTop: 4 }}>0.0072</div></div><div><div className="eyebrow" style={{ color: 'hsl(205 12% 72%)' }}>ETH</div><div className="money" style={{ fontSize: 12, marginTop: 4 }}>0.184</div></div></div></section><section className="card card-pad"><div className="section-head"><h2>Allocation</h2><span className="date-note">CURRENT</span></div><div className="chart" style={{ height: 126, gap: 13, alignItems: 'center', border: 0 }}><div style={{ height: 88, width: 88, borderRadius: '50%', background: 'conic-gradient(hsl(var(--accent)) 0 62%, hsl(var(--primary)) 62% 91%, hsl(var(--secondary)) 91% 100%)', position: 'relative' }}><div style={{ position: 'absolute', inset: 13, borderRadius: '50%', background: 'hsl(var(--card))' }} /></div><div><div className="side-stat" style={{ border: 0, padding: '5px 0' }}><span>Bitcoin</span><strong>62%</strong></div><div className="side-stat" style={{ padding: '5px 0' }}><span>Ethereum</span><strong>29%</strong></div><div className="side-stat" style={{ padding: '5px 0' }}><span>Other</span><strong>9%</strong></div></div></div></section></div><section className="card card-pad" style={{ marginTop: 18 }}><div className="section-head"><h2>Market snapshot</h2><span className="date-note">PRICES IN SEK · 2 MIN AGO</span></div><div className="market-grid">{markets.map(m => <div className="market-item" key={m.ticker}><div className="coin-row"><div className="coin-name"><div className="coin-icon">{m.ticker.slice(0, 1)}</div>{m.name}</div><TrendingUp size={14} color="hsl(var(--primary))" /></div><div className="coin-price">{m.price} <span style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))' }}>kr</span></div><div className={m.change.startsWith('−') ? 'status pending' : 'positive-text'} style={{ display: 'inline-flex', marginTop: 8 }}>{m.change} today</div></div>)}</div></section></main>;
}

function Profile({ profile, setProfile, onToast }: { profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>>; onToast: (s: string) => void }) {
  const language = profile.language ?? 'sv';
  const labels = copy[language];
  const update = (field: keyof Profile, value: string | boolean) => { setProfile(p => ({ ...p, [field]: value })); onToast(labels.preferenceSaved); };
  return <main className="content fade-in"><Intro kicker={language === 'sv' ? 'Ditt konto' : 'Your account'} title={language === 'sv' ? 'Profil och inställningar.' : 'Profile & preferences.'} detail={language === 'sv' ? 'Håll dina uppgifter och säkerhetsval uppdaterade.' : 'Keep your details and security choices up to date.'} /><div className="grid panel-grid"><section className="card card-pad"><div className="section-head"><h2>{labels.personalDetails}</h2><span className="date-note">{language === 'sv' ? 'PRIVAT' : 'PRIVATE'}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 24 }}><div className="avatar" style={{ width: 47, height: 47, flexBasis: 47, fontSize: 14 }}>MJ</div><div><strong style={{ fontSize: 15 }}>{profile.name}</strong><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, marginTop: 3 }}>@{profile.username}</div></div></div><div className="form-group"><label htmlFor="profile-name">{language === 'sv' ? 'Fullständigt namn' : 'Full name'}</label><input id="profile-name" className="input" value={profile.name} onChange={e => update('name', e.target.value)} data-testid="input-profile-name" /></div><div className="form-group"><label htmlFor="profile-address">{language === 'sv' ? 'Adress' : 'Address'}</label><input id="profile-address" className="input" value={profile.address} onChange={e => update('address', e.target.value)} data-testid="input-profile-address" /></div><div className="form-group"><label htmlFor="profile-currency">{language === 'sv' ? 'Standardvaluta' : 'Default currency'}</label><select id="profile-currency" className="select" value={profile.currency} onChange={e => update('currency', e.target.value)} data-testid="select-profile-currency"><option>SEK — Swedish krona</option><option>EUR — Euro</option><option>GBP — Pound sterling</option></select></div></section><section className="card card-pad"><div className="section-head"><h2>{labels.securityAlerts}</h2><ShieldCheck size={16} color="hsl(var(--primary))" /></div><ul className="settings-list"><li className="settings-item"><div className="settings-icon"><Settings size={16} /></div><div className="settings-copy"><strong>{labels.language}</strong><span>{labels.languageHint}</span></div><select className="settings-select" aria-label={labels.language} value={language} onChange={e => update('language', e.target.value as Language)} data-testid="select-language"><option value="sv">{labels.swedish}</option><option value="en">{labels.english}</option></select></li><li className="settings-item"><div className="settings-icon"><Bell size={16} /></div><div className="settings-copy"><strong>{language === 'sv' ? 'E-postaviseringar' : 'Email alerts'}</strong><span>{language === 'sv' ? 'Få en avisering för varje kortköp' : 'Receive a note for every card payment'}</span></div><button className={`switch ${profile.emailAlerts ? 'on' : ''}`} onClick={() => update('emailAlerts', !profile.emailAlerts)} aria-label={language === 'sv' ? 'Ändra e-postaviseringar' : 'Toggle email alerts'} data-testid="switch-email-alerts"><span /></button></li><li className="settings-item"><div className="settings-icon"><LockKeyhole size={16} /></div><div className="settings-copy"><strong>{language === 'sv' ? 'Biometrisk inloggning' : 'Biometric sign-in'}</strong><span>{language === 'sv' ? 'Använd Face ID eller fingeravtryck där det är möjligt' : 'Use Face ID or fingerprint where available'}</span></div><button className={`switch ${profile.biometric ? 'on' : ''}`} onClick={() => update('biometric', !profile.biometric)} aria-label={language === 'sv' ? 'Ändra biometrisk inloggning' : 'Toggle biometric sign-in'} data-testid="switch-biometric"><span /></button></li><li className="settings-item"><div className="settings-icon"><ShieldCheck size={16} /></div><div className="settings-copy"><strong>{language === 'sv' ? 'Tvåstegsverifiering' : 'Two-step verification'}</strong><span>{language === 'sv' ? 'Autentiseringsapp · aktiverad' : 'Authenticator app · enabled'}</span></div><Check size={16} color="hsl(var(--primary))" /></li></ul><button className="secondary-button" style={{ width: '100%', marginTop: 12 }} onClick={() => onToast(language === 'sv' ? 'Säkerhetscentret är uppdaterat' : 'Security centre is up to date')} data-testid="button-security-review">{language === 'sv' ? 'Öppna säkerhetscenter' : 'Review security centre'}</button></section></div></main>;
}

function Notifications({ notifications, setNotifications, onToast }: { notifications: Notification[]; setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>; onToast: (s: string) => void }) {
  const unread = notifications.filter(n => !n.read).length;
  const markAll = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); onToast('All notifications marked as read'); };
  return <main className="content fade-in"><Intro kicker="Stay in the know" title="Notifications." detail={`${unread ? `${unread} unread updates` : 'You’re all caught up'} · We only send what matters.`} action={unread > 0 ? <button className="secondary-button" onClick={markAll} data-testid="button-mark-all-read"><Check size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Mark all read</button> : undefined} /><section className="card card-pad" style={{ maxWidth: 820 }}>{notifications.map(n => <div className={`notification-row ${n.read ? 'read' : 'unread'}`} key={n.id} data-testid={`notification-${n.id}`}><div className="notification-marker" /><div className="notification-copy"><strong>{n.title}</strong><p>{n.detail}</p><time>{n.date}</time></div>{!n.read && <button className="read-button" onClick={() => { setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item)); onToast('Notification marked as read'); }} data-testid={`button-read-${n.id}`}>Mark read</button>}</div>)}</section></main>;
}

function App() {
  const [transactions, setTransactions] = usePersistentState<Transaction[]>('bestcash-transactions', initialTransactions);
  const [cards, setCards] = usePersistentState<CardData[]>('bestcash-cards', initialCards);
  const [notifications, setNotifications] = usePersistentState<Notification[]>('bestcash-notifications', initialNotifications);
  const [profile, setProfile] = usePersistentState<Profile>('bestcash-profile', { name: 'Mats Johansson', username: 'mats.johansson', address: 'Sankt Eriksgatan 42, 112 34 Stockholm', currency: 'SEK — Swedish krona', emailAlerts: true, biometric: true, language: 'sv' });
  const [visible, setVisible] = usePersistentState('bestcash-balance-visible', true);
  const [toast, setToast] = useState('');
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  const language = profile.language ?? 'sv';
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const unread = notifications.filter(n => !n.read).length;
  return <Shell unread={unread} language={language}><Switch><Route path="/"><Dashboard transactions={transactions} goals={initialGoals} visible={visible} setVisible={setVisible} onToast={showToast} /></Route><Route path="/transfers"><Transfers transactions={transactions} setTransactions={setTransactions} onToast={showToast} /></Route><Route path="/cards"><Cards cards={cards} setCards={setCards} onToast={showToast} /></Route><Route path="/history"><History transactions={transactions} /></Route><Route path="/crypto"><Crypto /></Route><Route path="/profile"><Profile profile={{ ...profile, language }} setProfile={setProfile} onToast={showToast} /></Route><Route path="/notifications"><Notifications notifications={notifications} setNotifications={setNotifications} onToast={showToast} /></Route><Route><main className="content"><Intro kicker="BestCash" title="Page not found." detail="This is not a place we recognize." /><Link href="/" className="primary-button" data-testid="link-back-home">Back to overview</Link></main></Route></Switch>{toast && <div className="toast" role="status" data-testid="status-toast">{toast}</div>}</Shell>;
}

export default App;