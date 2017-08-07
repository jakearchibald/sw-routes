import { requestHandler } from '../handler-types.js';
import { wait } from '../utils.js';

export default function fromNetwork({
  timeout
}={}) {
  return requestHandler(({ request }) => Promise.race([
    fetch(request).catch(() => undefined),
    wait(timeout)
  ]));
}
