import { requestHandler, RequestHandler } from '../handler-types';
import { wait } from '../utils';

/**
 * Fetch response from network.
 *
 * @param options
 * @param options.timeout Network timeout in milliseconds
 */
export default function fromNetwork({
  timeout = 0
}={}) {
  return requestHandler(({ request }) => {
    const networkFetch = <Promise<Response | null>>fetch(request).catch(() => null);

    if (timeout) return Promise.race([
      networkFetch,
      wait(timeout)
    ]);

    return networkFetch;
  });
}
