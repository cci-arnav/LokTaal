import type { Session, User } from '@supabase/supabase-js';
import { requireSupabase } from '@/lib/supabase';

export interface AuthCredentials { email: string; password: string; }
export interface SignUpDetails extends AuthCredentials { fullName: string; preferredLanguage: 'en' | 'hi'; }
export interface SignUpResult { user: User | null; session: Session | null; needsEmailConfirmation: boolean; }

function authMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login')) return 'The email or password is incorrect.';
  if (normalized.includes('email not confirmed')) return 'Confirm your email before logging in.';
  if (normalized.includes('already registered')) return 'An account already exists for this email.';
  if (normalized.includes('password')) return 'The password does not meet the authentication requirements.';
  if (normalized.includes('rate limit')) return 'Too many attempts. Wait a moment and try again.';
  return 'Authentication could not be completed. Please try again.';
}

export const authService = {
  async signIn(credentials: AuthCredentials): Promise<Session> {
    const { data, error } = await requireSupabase().auth.signInWithPassword(credentials);
    if (error || !data.session) throw new Error(error ? authMessage(error.message) : 'A session could not be created.');
    return data.session;
  },

  async signUp(details: SignUpDetails): Promise<SignUpResult> {
    const { data, error } = await requireSupabase().auth.signUp({
      email: details.email,
      password: details.password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, data: { full_name: details.fullName.trim(), preferred_language: details.preferredLanguage } },
    });
    if (error) throw new Error(authMessage(error.message));
    return { user: data.user, session: data.session, needsEmailConfirmation: Boolean(data.user && !data.session) };
  },

  async signOut(): Promise<void> {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw new Error('Logout could not be completed. Please try again.');
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await requireSupabase().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) throw new Error(authMessage(error.message));
  },

  async updatePassword(password: string): Promise<void> {
    const { error } = await requireSupabase().auth.updateUser({ password });
    if (error) throw new Error(authMessage(error.message));
  },

  async exchangeCode(code: string): Promise<void> {
    const client = requireSupabase();
    const current = await client.auth.getSession();
    if (current.data.session) return;
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (error) throw new Error(authMessage(error.message));
  },
};
