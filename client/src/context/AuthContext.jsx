import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile } from "../services/authService";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    let active = true;
    if (!token) { setAuthReady(true); return () => { active = false; }; }
    getProfile().then((data) => {
      if (active && data.user) { setUser(data.user); sessionStorage.setItem("user", JSON.stringify(data.user)); }
    }).catch(() => {
      if (active) { sessionStorage.removeItem("token"); sessionStorage.removeItem("user"); setToken(null); setUser(null); }
    }).finally(() => { if (active) setAuthReady(true); });
    return () => { active = false; };
  }, [token]);
  const login = (data) => {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token); setUser(data.user); setAuthReady(true);
  };
  const logout = () => {
    sessionStorage.removeItem("token"); sessionStorage.removeItem("user");
    setToken(null); setUser(null); setAuthReady(true);
  };
  const value = useMemo(() => ({ user, token, authReady, login, logout, isAuthenticated: Boolean(token && user) }), [user, token, authReady]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
