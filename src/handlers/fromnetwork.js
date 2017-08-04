import { requestHandler } from '../handler-types.js';

export default function fromNetwork() {
  return requestHandler(({ request }) => fetch(request).catch(() => undefined));
}
