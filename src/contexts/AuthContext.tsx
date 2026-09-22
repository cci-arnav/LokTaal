import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService } from '@/services/authService';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/types/backend';

interface AuthValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  configured: boolean;
  refreshAuthorization: () => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAuthorization = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!supabase || !nextSession?.user) { setProfile(null); setIsAdmin(false); setLoading(false); return; }
    const [profileResult, adminResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', nextSession.user.id).maybeSingle(),
      supabase.rpc('is_admin'),
    ]);
    setProfile((profileResult.data as Profile | null) ?? null);
    setIsAdmin(adminResult.data === true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) void loadAuthorization(data.session); });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => { if (active) window.setTimeout(() => void loadAuthorization(nextSession), 0); });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, [loadAuthorization]);

  const refreshAuthorization = useCallback(async () => { if (supabase) { const { data } = await supabase.auth.getSession(); await loadAuthorization(data.session); } }, [loadAuthorization]);
  const signOut = useCallback(async () => { await authService.signOut(); }, []);
  const value = useMemo(() => ({ session, user: session?.user ?? null, profile, isAuthenticated: Boolean(session), isAdmin, loading, configured: isSupabaseConfigured, refreshAuthorization, signOut }), [session, profile, isAdmin, loading, refreshAuthorization, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
