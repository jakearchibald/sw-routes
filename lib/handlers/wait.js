import { anyHandler } from '../handler-types';
import { wait as waitPromise } from '../utils';
/**
 * Handler that waits a given number of milliseconds.
 *
 * @param ms Milliseconds to wait
 */
export default function wait(ms) {
    return anyHandler(() => waitPromise(ms));
}
