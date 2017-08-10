/**
 * Returns a promise that resolves in a given number of milliseconds.
 */
export function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}
