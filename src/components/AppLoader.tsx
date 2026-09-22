import { motion, useReducedMotion } from 'framer-motion';
import logo from '@/assets/branding/loktaal-logo.png';
import { useI18n } from '@/contexts/I18nContext';

export function AppLoader() {
  const reduced = useReducedMotion();
  const { t } = useI18n();
  return <div role="status" aria-live="polite" aria-label={t('common.loading')} className="fixed inset-0 z-[120] flex items-center justify-center bg-[radial-gradient(circle_at_center,#6d28b6_0%,#3d176d_46%,#180e2d_100%)] text-white">
    <div className="flex flex-col items-center px-6 text-center">
      <div className="rounded-2xl px-4 py-2"><img src={logo} alt="Loktaal" className="h-auto w-52 sm:w-64" /></div>
      <div className="mt-8 flex h-12 items-center gap-1" aria-hidden="true">{Array.from({ length: 13 }).map((_, index) => <motion.span key={index} className="w-1.5 rounded-full bg-gradient-to-t from-[#E06543] to-[#F0B23D]" animate={reduced ? { height: 18 } : { height: [12, 42 - Math.abs(6 - index) * 4, 12] }} transition={{ duration: .9, repeat: Infinity, delay: index * .055, ease: 'easeInOut' }} />)}</div>
      <p className="mt-4 text-sm text-white/75">{t('common.loading')}</p>
    </div>
  </div>;
}
