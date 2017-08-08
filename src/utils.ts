/**
 * Returns a promise that resolves in a given number of milliseconds.
 */
export function wait(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
