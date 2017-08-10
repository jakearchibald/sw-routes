import { requestHandler, HandlerDefinition } from '../handler-types';

/**
 * Lookup if a response came from a cache (eg, to avoid recaching)
 */
export const originallyFromCache:WeakMap<Response, boolean> = new WeakMap();

/**
 * Get the response from the cache.
 *
 * @param opts Options passed to caches.match()
 */
function fromCache(opts?: CacheQueryOptions);
/**
 * Get a specific response from the cache.
 *
 * @param request Look for a match to this in the cache.
 * @param opts Options passed to caches.match().
 */
function fromCache(request: Request | string, opts?: CacheQueryOptions);
function fromCache(requestOrOpts?: Request | string | CacheQueryOptions, opts?: CacheQueryOptions) {
  let providedRequest: Request | string;

  if (requestOrOpts instanceof Request || typeof requestOrOpts == 'string') {
    providedRequest = requestOrOpts;
  }
  else {
    opts = requestOrOpts;
  }

  return requestHandler(async ({ request }) => {
    const response: Response = await caches.match(providedRequest || request, opts);
    if (response) originallyFromCache.set(response, true);
    return response;
  });
}

export default fromCache;
