import { requestHandler, HandlerDefinition } from '../handler-types';
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
    const networkFetch = fetch(request).catch(() => undefined);

    if (timeout) return Promise.race([
      networkFetch,
      wait(timeout)
    ]);

    return networkFetch;
  });
}
