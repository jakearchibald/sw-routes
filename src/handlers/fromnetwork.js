import { requestHandler } from '../handler-types.js';
import { wait } from '../utils.js';

export default function fromNetwork({
  timeout
}={}) {
  return requestHandler(({ request }) => {
    const networkFetch = fetch(request).catch(() => undefined);

    if (timeout) {
      return Promise.race([
        networkFetch,
        wait(timeout)
      ])
    }

    return networkFetch;
  });
}
