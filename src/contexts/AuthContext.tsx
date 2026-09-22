import { createContext, useContext, useMemo, useState } from 'react';

interface AuthValue { isAuthenticatedPreview: boolean; enableAuthenticatedPreview: () => void; clearPreview: () => void; }
const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [preview, setPreview] = useState(false);
  const value = useMemo(() => ({ isAuthenticatedPreview: preview, enableAuthenticatedPreview: () => setPreview(true), clearPreview: () => setPreview(false) }), [preview]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
