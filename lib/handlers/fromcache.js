import { requestHandler } from '../handler-types';
/**
 * Lookup if a response came from a cache (eg, to avoid recaching)
 */
export const originallyFromCache = new WeakMap();
function fromCache(requestOrOpts, opts) {
    let providedRequest;
    if (requestOrOpts instanceof Request || typeof requestOrOpts == 'string') {
        providedRequest = requestOrOpts;
    }
    else {
        opts = requestOrOpts;
    }
    return requestHandler(async ({ request }) => {
        const response = await caches.match(providedRequest || request, opts);
        if (response)
            originallyFromCache.set(response, true);
        return response;
    });
}
export default fromCache;
