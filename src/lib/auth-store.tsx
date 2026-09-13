import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { findAccountRecord } from "@/data/bank";

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
    const storedUsername = window.localStorage.getItem(ACCOUNT_KEY);
    const storedAccount = findAccountRecord(storedUsername);
    const hasValidSession =
      window.localStorage.getItem(SESSION_KEY) === "active" && Boolean(storedAccount);

    if (hasValidSession && storedAccount) {
      setAuthenticated(true);
      setAccountUsername(storedAccount.credentials.username);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(ACCOUNT_KEY);
      setAuthenticated(false);
      setAccountUsername(null);
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      authenticated,
      loading,
      accountUsername,
      login: (username, pin) => {
        const account = findAccountRecord(username);
        if (!account || pin.trim() !== account.credentials.loginPin) return false;

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