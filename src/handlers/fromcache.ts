import { requestHandler, HandlerDefinition } from '../handler-types';

/**
 * Get a response from the cache.
 *
 * @param opts Options passed to caches.match()
 */
export default function fromCache(opts: CacheQueryOptions) {
  return requestHandler(async ({ request }) => {
    const response = await caches.match(request, opts);
    if (response) response._fromCache = true;
    return response;
  });
}
