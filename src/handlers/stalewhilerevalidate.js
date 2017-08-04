import { requestHandler } from '../handler-types.js';

export default function staleWhileRevalidate(cacheName) {
  return requestHandler(async fetchDetails => {
    const networkResponse = fetch(fetchDetails.request);
    const networkResponseClone = networkResponse.then(r => r.clone());
    const cache = await caches.open(cacheName);

    fetchDetails.waitUntil((async () => {
      const response = await networkResponseClone;
      if (!response.ok) return;
      await cache.put(fetchDetails.request, response);
    })());

    const cacheResponse = await cache.match(fetchDetails.request);

    if (cacheResponse) cacheResponse._fromCache = true;

    return cacheResponse || networkResponse.catch(() => null);
  });
}
