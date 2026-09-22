import { useEffect, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import logo from '@/assets/branding/loktaal-logo.png';
import { AppLink, useRouter } from '@/contexts/RouterContext';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { safeRedirect } from '@/lib/routing';
import { supabaseConfigurationMessage } from '@/lib/supabase';

export function LoginPage() {
  const { t, language } = useI18n();
  const { search, navigate } = useRouter();
  const { configured, refreshAuthorization } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({ text: '', error: false });
  const [busy, setBusy] = useState(false);
  const redirect = safeRedirect(search.get('redirect'), '/upload');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage({ text: '', error: false });
    if (!/^\S+@\S+\.\S+$/.test(values.email) || !values.password) { setMessage({ text: language === 'hi' ? 'मान्य ईमेल और पासवर्ड दर्ज करें।' : 'Enter a valid email and password.', error: true }); return; }
    setBusy(true);
    try { await authService.signIn(values); await refreshAuthorization(); navigate(redirect, { replace: true }); }
    catch (reason) { setMessage({ text: reason instanceof Error ? reason.message : 'Login could not be completed.', error: true }); }
    finally { setBusy(false); }
  };
  const forgot = async () => {
    setMessage({ text: '', error: false });
    if (!/^\S+@\S+\.\S+$/.test(values.email)) { setMessage({ text: language === 'hi' ? 'पहले अपना मान्य ईमेल दर्ज करें।' : 'Enter your valid email first.', error: true }); return; }
    setBusy(true);
    try { await authService.requestPasswordReset(values.email); setMessage({ text: language === 'hi' ? 'यदि खाता मौजूद है, तो रीसेट लिंक ईमेल कर दिया गया है।' : 'If the account exists, a reset link has been emailed.', error: false }); }
    catch (reason) { setMessage({ text: reason instanceof Error ? reason.message : 'The reset email could not be sent.', error: true }); }
    finally { setBusy(false); }
  };
  return <AuthLayout><form onSubmit={submit} noValidate className="rounded-3xl border border-white/15 bg-white/[.07] p-6 shadow-2xl backdrop-blur-xl sm:p-9"><AuthHeading configured={configured} title={t('auth.login')} />{message.text && <Message error={message.error}>{message.text}</Message>}<div className="mt-6 space-y-4"><Field label={t('auth.email')} type="email" autoComplete="email" value={values.email} onChange={(value) => setValues({ ...values, email: value })} /><PasswordField label={t('auth.password')} value={values.password} show={show} setShow={setShow} onChange={(value) => setValues({ ...values, password: value })} showText={show ? t('auth.hide') : t('auth.show')} /></div><button disabled={!configured || busy} type="submit" className="mt-6 min-h-12 w-full rounded-full bg-gradient-to-r from-[#E06543] to-[#F0B23D] font-bold text-[#25113f] disabled:opacity-50">{busy ? (language === 'hi' ? 'कृपया प्रतीक्षा करें…' : 'Please wait…') : t('auth.login')}</button><button disabled={!configured || busy} type="button" onClick={forgot} className="mt-3 w-full text-sm text-[#D8C5EA] underline underline-offset-4 disabled:opacity-50">{t('auth.forgot')}</button><p className="mt-6 text-center text-sm text-white/65">{t('auth.noAccount')} <AppLink to={`/signup?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-[#F0B23D]">{t('auth.signup')}</AppLink></p></form></AuthLayout>;
}

export function SignupPage() {
  const { t, language } = useI18n(); const { search, navigate } = useRouter(); const { configured, refreshAuthorization } = useAuth();
  const [show, setShow] = useState(false); const [values, setValues] = useState({ fullName: '', email: '', password: '', confirm: '', terms: false }); const [message, setMessage] = useState({ text: '', error: false }); const [busy, setBusy] = useState(false);
  const redirect = safeRedirect(search.get('redirect'), '/upload');
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setMessage({ text: '', error: false }); if (!values.fullName.trim() || !/^\S+@\S+\.\S+$/.test(values.email) || values.password.length < 8 || values.password !== values.confirm || !values.terms) { setMessage({ text: language === 'hi' ? 'सभी फ़ील्ड जाँचें, कम से कम 8 अक्षर रखें और दोनों पासवर्ड मिलाएँ।' : 'Check every field, use at least 8 characters, and make sure the passwords match.', error: true }); return; } setBusy(true); try { const result = await authService.signUp({ fullName: values.fullName, email: values.email, password: values.password, preferredLanguage: language }); if (result.session) { await refreshAuthorization(); navigate(redirect, { replace: true }); } else setMessage({ text: language === 'hi' ? 'अपना ईमेल खोलें और खाते की पुष्टि करें, फिर लॉग इन करें।' : 'Open your email and confirm the account, then log in.', error: false }); } catch (reason) { setMessage({ text: reason instanceof Error ? reason.message : 'Sign up could not be completed.', error: true }); } finally { setBusy(false); } };
  return <AuthLayout><form onSubmit={submit} noValidate className="rounded-3xl border border-white/15 bg-white/[.07] p-6 shadow-2xl backdrop-blur-xl sm:p-9"><AuthHeading configured={configured} title={t('auth.signup')} />{message.text && <Message error={message.error}>{message.text}</Message>}<div className="mt-6 space-y-4"><Field label={t('auth.fullName')} autoComplete="name" value={values.fullName} onChange={(value) => setValues({ ...values, fullName: value })} /><Field label={t('auth.email')} type="email" autoComplete="email" value={values.email} onChange={(value) => setValues({ ...values, email: value })} /><PasswordField label={t('auth.password')} value={values.password} show={show} setShow={setShow} onChange={(value) => setValues({ ...values, password: value })} showText={show ? t('auth.hide') : t('auth.show')} /><Field label={t('auth.confirm')} type={show ? 'text' : 'password'} autoComplete="new-password" value={values.confirm} onChange={(value) => setValues({ ...values, confirm: value })} /><p className="text-xs text-white/55">{language === 'hi' ? 'कम से कम 8 अक्षर रखें।' : 'Use at least 8 characters.'}</p><label className="flex gap-3 text-sm text-white/70"><input type="checkbox" checked={values.terms} onChange={(event) => setValues({ ...values, terms: event.target.checked })} className="mt-1 h-5 w-5 accent-[#F0B23D]" />{t('auth.terms')}</label></div><button disabled={!configured || busy} type="submit" className="mt-6 min-h-12 w-full rounded-full bg-gradient-to-r from-[#E06543] to-[#F0B23D] font-bold text-[#25113f] disabled:opacity-50">{busy ? (language === 'hi' ? 'कृपया प्रतीक्षा करें…' : 'Please wait…') : t('auth.signup')}</button><p className="mt-6 text-center text-sm text-white/65">{t('auth.haveAccount')} <AppLink to={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-[#F0B23D]">{t('auth.login')}</AppLink></p></form></AuthLayout>;
}

export function ResetPasswordPage() {
  const { language } = useI18n(); const { navigate } = useRouter(); const { configured } = useAuth(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (password.length < 8 || password !== confirm) { setError(language === 'hi' ? 'पासवर्ड कम से कम 8 अक्षर का हो और दोनों पासवर्ड मिलें।' : 'Use at least 8 characters and make sure both passwords match.'); return; } setBusy(true); try { await authService.updatePassword(password); navigate('/login', { replace: true }); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Password could not be updated.'); } finally { setBusy(false); } };
  return <AuthLayout><form onSubmit={submit} className="rounded-3xl border border-white/15 bg-white/[.07] p-6 sm:p-9"><AuthHeading configured={configured} title={language === 'hi' ? 'नया पासवर्ड बनाएँ' : 'Create a new password'} />{error && <Message error>{error}</Message>}<div className="mt-6 space-y-4"><Field label={language === 'hi' ? 'नया पासवर्ड' : 'New password'} type="password" autoComplete="new-password" value={password} onChange={setPassword} /><Field label={language === 'hi' ? 'पासवर्ड की पुष्टि' : 'Confirm password'} type="password" autoComplete="new-password" value={confirm} onChange={setConfirm} /></div><button disabled={!configured || busy} className="mt-6 min-h-12 w-full rounded-full bg-[#F0B23D] font-bold text-[#25113f] disabled:opacity-50">{language === 'hi' ? 'पासवर्ड सहेजें' : 'Save password'}</button></form></AuthLayout>;
}

export function AuthCallbackPage() {
  const { language } = useI18n(); const { search, navigate } = useRouter(); const { refreshAuthorization } = useAuth(); const [error, setError] = useState('');
  useEffect(() => { const code = search.get('code'); if (!code) { navigate('/login', { replace: true }); return; } authService.exchangeCode(code).then(refreshAuthorization).then(() => navigate('/my-submissions', { replace: true })).catch((reason) => setError(reason instanceof Error ? reason.message : 'The sign-in link could not be completed.')); }, [navigate, refreshAuthorization, search]);
  return <AuthLayout><section className="rounded-3xl border border-white/15 bg-white/[.07] p-9 text-center">{error ? <Message error>{error}</Message> : <p>{language === 'hi' ? 'सुरक्षित साइन-इन पूरा हो रहा है…' : 'Completing secure sign-in…'}</p>}</section></AuthLayout>;
}

function AuthHeading({ configured, title }: { configured: boolean; title: string }) { return <><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#F0B23D]"><LockKeyhole className="h-4 w-4" />Secure Supabase authentication</p><h1 className="mt-4 font-devanagari text-3xl">{title}</h1>{!configured && <Message error>{supabaseConfigurationMessage}</Message>}</>; }
function Message({ children, error }: { children: React.ReactNode; error?: boolean }) { return <div role={error ? 'alert' : 'status'} className={`mt-5 rounded-xl border p-3 text-sm ${error ? 'border-[#ff9e86]/30 bg-[#ff9e86]/10 text-[#ffc4b7]' : 'border-[#8fd9af]/30 bg-[#8fd9af]/10 text-[#baf0ce]'}`}>{children}</div>; }
function AuthLayout({ children }: { children: React.ReactNode }) { const { t } = useI18n(); return <main data-theme="midnight-raga" className="min-h-screen bg-[radial-gradient(circle_at_80%_15%,rgba(147,51,234,.5),transparent_32%),linear-gradient(135deg,#25113f,#5B21B6_60%,#5B1F2A)] px-4 pb-16 pt-28 text-white sm:px-6"><div className="mx-auto max-w-lg"><AppLink to="/" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-white/65"><ArrowLeft className="h-4 w-4" />{t('common.backHome')}</AppLink><div className="mb-5 flex justify-center"><img src={logo} alt="Loktaal" className="w-44 rounded-xl bg-black/25 p-2" /></div>{children}</div></main>; }
function Field({ label, value, onChange, type = 'text', autoComplete }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><input required autoComplete={autoComplete} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 outline-none focus:border-[#F0B23D]" /></label>; }
function PasswordField({ label, value, onChange, show, setShow, showText }: { label: string; value: string; onChange: (value: string) => void; show: boolean; setShow: (value: boolean) => void; showText: string }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><span className="flex min-h-12 items-center rounded-xl border border-white/15 bg-white/5 pr-2 focus-within:border-[#F0B23D]"><input required autoComplete="current-password" type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 outline-none" /><button type="button" onClick={() => setShow(!show)} aria-label={showText} className="flex h-10 w-10 items-center justify-center rounded-lg">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>; }
