import { requestHandler } from '../handler-types.js';

export default function fromCache(request, opts) {
  return requestHandler(() => caches.matchAll(request, opts));
}
