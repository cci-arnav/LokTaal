export interface AuthCredentials { email: string; password: string; }
export interface SignUpDetails extends AuthCredentials { fullName: string; }
export interface AuthService {
  signIn(credentials: AuthCredentials): Promise<never>;
  signUp(details: SignUpDetails): Promise<never>;
  signOut(): Promise<void>;
}

// Supabase integration point: replace this adapter with Supabase Auth in the next phase.
export const frontendOnlyAuthService: AuthService = {
  async signIn() { throw new Error('Authentication is not connected yet. Use the clearly labelled UI preview.'); },
  async signUp() { throw new Error('Account creation requires the upcoming Supabase integration.'); },
  async signOut() { return Promise.resolve(); },
};
