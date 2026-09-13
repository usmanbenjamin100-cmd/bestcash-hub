import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { accountRecords, type AccountRecord } from "@/data/bank";

const SESSION_KEY = "bestcash-authenticated";
const ACCOUNT_KEY = "bestcash-account";

interface AuthState {
  authenticated: boolean;
  loading: boolean;
  accountUsername: string | null;
  login: (username: string, pin: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountUsername, setAccountUsername] = useState<string | null>(null);

  useEffect(() => {
    setAuthenticated(window.localStorage.getItem(SESSION_KEY) === "active");
    setAccountUsername(window.localStorage.getItem(ACCOUNT_KEY));
    setLoading(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      authenticated,
      loading,
      accountUsername,
      login: (username, pin) => {
        const account = accountRecords.find(
          (candidate: AccountRecord) =>
            username.trim().toLowerCase() === candidate.credentials.username &&
            pin === candidate.credentials.loginPin,
        );
        if (!account) return false;

        window.localStorage.setItem(SESSION_KEY, "active");
        window.localStorage.setItem(ACCOUNT_KEY, account.credentials.username);
        setAccountUsername(account.credentials.username);
        setAuthenticated(true);
        return true;
      },
      logout: () => {
        window.localStorage.removeItem(SESSION_KEY);
        window.localStorage.removeItem(ACCOUNT_KEY);
        setAccountUsername(null);
        setAuthenticated(false);
      },
    }),
    [accountUsername, authenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}