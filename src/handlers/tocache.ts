import { responseWaitUntilHandler, VoidHandlerDefinition } from '../handler-types';

/**
 * Add response to the cache (unless it came from the cache).
 *
 * @param cacheName
 */
export default function toCache(cacheName: string) {
  return responseWaitUntilHandler(async fetchDetails => {
    if (fetchDetails.response._fromCache || !fetchDetails.response.ok) return;

    const responseClone = fetchDetails.response.clone();
    const cache = await caches.open(cacheName);
    await cache.put(fetchDetails.request, responseClone);
  });
}
