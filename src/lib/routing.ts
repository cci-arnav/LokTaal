export type RouteMatch =
  | { name: 'home' }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'reset-password' }
  | { name: 'auth-callback' }
  | { name: 'upload' }
  | { name: 'my-submissions' }
  | { name: 'admin-submissions' }
  | { name: 'state'; slug: string }
  | { name: 'not-found' };

export function matchRoute(pathname: string): RouteMatch {
  if (pathname === '/') return { name: 'home' };
  if (pathname === '/login') return { name: 'login' };
  if (pathname === '/signup') return { name: 'signup' };
  if (pathname === '/reset-password') return { name: 'reset-password' };
  if (pathname === '/auth/callback') return { name: 'auth-callback' };
  if (pathname === '/upload') return { name: 'upload' };
  if (pathname === '/my-submissions') return { name: 'my-submissions' };
  if (pathname === '/admin/submissions') return { name: 'admin-submissions' };
  const stateMatch = pathname.match(/^\/states\/([a-z0-9-]+)$/);
  if (stateMatch) return { name: 'state', slug: stateMatch[1] };
  return { name: 'not-found' };
}

export type RouteAccess = 'public' | 'authenticated' | 'admin';

export function requiredAccess(route: RouteMatch): RouteAccess {
  if (route.name === 'admin-submissions') return 'admin';
  if (route.name === 'upload' || route.name === 'my-submissions') return 'authenticated';
  return 'public';
}

export function authorizeRoute(route: RouteMatch, authenticated: boolean, admin: boolean): 'allow' | 'login' | 'home' {
  const access = requiredAccess(route);
  if ((access === 'authenticated' || access === 'admin') && !authenticated) return 'login';
  if (access === 'admin' && !admin) return 'home';
  return 'allow';
}

export function safeRedirect(value: string | null, fallback = '/'): string {
  return value?.startsWith('/') && !value.startsWith('//') ? value : fallback;
}
