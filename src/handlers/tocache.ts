import { responseWaitUntilHandler, VoidHandlerDefinition } from '../handler-types';
import { originallyFromCache } from './fromcache';

/**
 * Add response to the cache (unless it came from the cache).
 *
 * @param cacheName
 */
export default function toCache(cacheName: string) {
  return responseWaitUntilHandler(async ({response, request}) => {
    if (originallyFromCache.get(response) || !response.ok) return;

    const responseClone = response.clone();
    const cache = await caches.open(cacheName);
    await cache.put(request, responseClone);
  });
}
