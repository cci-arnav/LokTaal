export type RouteMatch =
  | { name: 'home' }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'upload' }
  | { name: 'state'; slug: string }
  | { name: 'not-found' };

export function matchRoute(pathname: string): RouteMatch {
  if (pathname === '/') return { name: 'home' };
  if (pathname === '/login') return { name: 'login' };
  if (pathname === '/signup') return { name: 'signup' };
  if (pathname === '/upload') return { name: 'upload' };
  const stateMatch = pathname.match(/^\/states\/([a-z0-9-]+)$/);
  if (stateMatch) return { name: 'state', slug: stateMatch[1] };
  return { name: 'not-found' };
}

export function safeRedirect(value: string | null, fallback = '/'): string {
  return value?.startsWith('/') && !value.startsWith('//') ? value : fallback;
}
