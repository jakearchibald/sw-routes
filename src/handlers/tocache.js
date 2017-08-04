import { responseWaitUntilHandler } from '../handler-types.js';

export default function toCache(cacheName) {
  return responseWaitUntilHandler(async fetchDetails => {
    if (fetchDetails.response._fromCache || !fetchDetails.response.ok) return;

    const responseClone = fetchDetails.response.clone();
    const cache = await caches.open(cacheName);
    await cache.put(fetchDetails.request, responseClone);
  });
}
