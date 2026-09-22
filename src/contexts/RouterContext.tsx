import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { matchRoute } from '@/lib/routing';

interface RouterValue {
  path: string;
  search: URLSearchParams;
  route: ReturnType<typeof matchRoute>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState(() => window.location.pathname + window.location.search);
  useEffect(() => {
    const update = () => setLocation(window.location.pathname + window.location.search);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) window.history.replaceState({}, '', to);
    else window.history.pushState({}, '', to);
    setLocation(window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  const value = useMemo(() => { const url = new URL(location, window.location.origin); return { path: url.pathname, search: url.searchParams, route: matchRoute(url.pathname), navigate }; }, [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error('useRouter must be used inside RouterProvider');
  return value;
}

export function AppLink({ to, children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { navigate } = useRouter();
  return <a href={to} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey) { event.preventDefault(); navigate(to); } }} {...props}>{children}</a>;
}
