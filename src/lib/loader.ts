export const LOADER_MIN_MS = 350;
export const LOADER_FAILSAFE_MS = 3000;
export function loaderMayClose(
  startedAt: number,
  now: number,
  ready: boolean,
): boolean {
  return (
    (ready && now - startedAt >= LOADER_MIN_MS) ||
    now - startedAt >= LOADER_FAILSAFE_MS
  );
}
