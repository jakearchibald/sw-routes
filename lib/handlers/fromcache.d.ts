/**
 * Lookup if a response came from a cache (eg, to avoid recaching)
 */
export declare const originallyFromCache: WeakMap<Response, boolean>;
/**
 * Get the response from the cache.
 *
 * @param opts Options passed to caches.match()
 */
declare function fromCache(opts?: CacheQueryOptions): any;
/**
 * Get a specific response from the cache.
 *
 * @param request Look for a match to this in the cache.
 * @param opts Options passed to caches.match().
 */
declare function fromCache(request: Request | string, opts?: CacheQueryOptions): any;
export default fromCache;
