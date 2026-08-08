import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoCredentials } from "@/data/bank";

const SESSION_KEY = "bestcash-demo-session";

interface AuthState {
  authenticated: boolean;
  loading: boolean;
  login: (username: string, pin: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(window.localStorage.getItem(SESSION_KEY) === "active");
    setLoading(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      authenticated,
      loading,
      login: (username, pin) => {
        const valid =
          username.trim().toLowerCase() === demoCredentials.username &&
          pin === demoCredentials.loginPin;
        if (valid) {
          window.localStorage.setItem(SESSION_KEY, "active");
          setAuthenticated(true);
        }
        return valid;
      },
      logout: () => {
        window.localStorage.removeItem(SESSION_KEY);
        setAuthenticated(false);
      },
    }),
    [authenticated, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
