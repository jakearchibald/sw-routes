import { RequestHandler } from '../handler-types';
/**
 * Fetch response from network.
 *
 * @param options
 * @param options.timeout Network timeout in milliseconds
 */
export default function fromNetwork({timeout}?: {
    timeout?: number;
}): RequestHandler;
