import { responseWaitUntilHandler, VoidHandlerDefinition } from '../handler-types';
import { originallyFromCache } from './fromcache';

/**
 * Add response to the cache, unless it came from the cache, in which case fetch an updated version and cache it.
 *
 * @param cacheName
 */
export default function updateCache(cacheName: string) {
  return responseWaitUntilHandler(async ({response, request}) => {
    const responseClone = response.clone();
    const cache = await caches.open(cacheName);

    if (originallyFromCache.get(response)) {
      // Cache a fresh copy
      await cache.add(request);
      return;
    }

    if (!response.ok) return;

    await cache.put(request, responseClone);
  });
}
