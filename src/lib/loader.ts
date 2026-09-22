export const LOADER_MIN_MS = 0;
export const LOADER_FAILSAFE_MS = 1750;
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
