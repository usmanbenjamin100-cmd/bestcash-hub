# BestCash Mobile Banking

Create online banking mvp make it so real , under the atm section use that ATM card and use the first picture as logo add full functionality to bestcash/

├── src/

│ ├── app/

│ │ ├── router.tsx

│ │ ├── App.tsx

│ │ └── providers.tsx

│ ├── components/

│ │ ├── layout/

│ │ │ ├── AppShell.tsx

│ │ │ ├── Sidebar.tsx

│ │ │ ├── MobileNav.tsx

│ │ │ └── Topbar.tsx

│ │ ├── dashboard/

│ │ │ ├── BalanceCard.tsx

│ │ │ ├── QuickActions.tsx

│ │ │ ├── InsightsCard.tsx

│ │ │ ├── SavingsGoals.tsx

│ │ │ └── TransactionList.tsx

│ │ ├── cards/

│ │ │ ├── VirtualCard.tsx

│ │ │ ├── CardControls.tsx

│ │ │ └── RewardsTracker.tsx

│ │ ├── transfers/

│ │ │ ├── TransferForm.tsx

│ │ │ ├── RecipientPicker.tsx

│ │ │ ├── FxPreview.tsx

│ │ │ └── ConfirmationPanel.tsx

│ │ └── ui/

│ │ ├── Button.tsx

│ │ ├── Card.tsx

│ │ ├── Input.tsx

│ │ ├── Modal.tsx

│ │ ├── Toast.tsx

│ │ └── EmptyState.tsx

│ ├── pages/

│ │ ├── HomePage.tsx

│ │ ├── SignInPage.tsx

│ │ ├── DashboardPage.tsx

│ │ ├── TransferPage.tsx

│ │ ├── HistoryPage.tsx

│ │ ├── CardsPage.tsx

│ │ ├── CryptoPage.tsx

│ │ ├── ProfilePage.tsx

│ │ ├── ToolsPage.tsx

│ │ ├── NotificationsPage.tsx

│ │ └── SupportPage.tsx

│ ├── data/

│ │ ├── accounts.ts

│ │ ├── transactions.ts

│ │ ├── cards.ts

│ │ ├── crypto.ts

│ │ └── profile.ts

│ ├── hooks/

│ │ ├── useTheme.ts

│ │ ├── useToast.ts

│ │ └── useMockTransfer.ts

│ ├── types/

│ │ ├── account.ts

│ │ ├── transaction.ts

│ │ ├── card.ts

│ │ └── user.ts

│ ├── lib/

│ │ ├── currency.ts

│ │ ├── date.ts

│ │ └── validation.ts

│ └── styles/

│ └── globals.css

├── public/

│ └── bestcash-logo.png

├── tailwind.config.ts

├── vite.config.ts

└── package.json

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bestcash-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/52210830-6f46-4223-b906-8043ca48e28a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
