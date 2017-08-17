import ifUrl from './handlers/ifurl';
import ifMethod from './handlers/ifmethod';
import { requestHandler } from './handler-types';
export class FetchData {
    constructor(data) {
        this.request = data.request;
        this.preloadResponse = data.preloadResponse;
        this.clientId = data.clientId;
        if (data instanceof FetchData) {
            this.url = data.url;
            this.params = data.params;
            this.waitUntil = data.waitUntil;
            // Copy additional properties
            for (const [key, val] of Object.entries(data)) {
                if (!(key in this))
                    this[key] = val;
            }
        }
        else {
            this.url = new URL(data.request.url);
            this.waitUntil = data.waitUntil.bind(data);
        }
    }
}
class Router {
    constructor() {
        this._handlers = [];
    }
    /**
     * Add items to this router.
     *
     * @param items Request/response/conditional/error handlers, or sub-routers.
     */
    add(...items) {
        this._handlers.push(...items.map(item => {
            if (typeof item == 'function')
                return requestHandler(item);
            return item;
        }));
    }
    all(firstItem, ...items) {
        const router = new Router();
        if (typeof firstItem == 'string') {
            router.add(ifUrl(firstItem));
        }
        else {
            router.add(firstItem);
        }
        router.add(...items);
        this.add(router);
    }
    /**
     * Handle a particular fetch event.
     *
     * This allows you to get a result from this router without having it take over your whole fetch event.
     */
    async handle(fetchData) {
        if (fetchData instanceof FetchEvent) {
            fetchData = new FetchData(fetchData);
        }
        for (const handler of this._handlers) {
            try {
                // Handle nested routers
                if (handler instanceof Router) {
                    fetchData.response = (await handler.handle(fetchData)) || fetchData.response;
                    fetchData.error = null;
                    continue;
                }
                switch (handler.type) {
                    case 'any':
                        if (fetchData.error)
                            continue;
                        fetchData.response = await handler.func(fetchData) || fetchData.response;
                        break;
                    case 'conditional':
                        if (fetchData.error)
                            continue;
                        if (await handler.func(fetchData) == false)
                            return fetchData.response;
                        break;
                    case 'request':
                        if (fetchData.response || fetchData.error)
                            continue;
                        fetchData.response = await handler.func(fetchData) || null;
                        break;
                    case 'response':
                        if (fetchData.error || !fetchData.response)
                            continue;
                        fetchData.response = (await handler.func(fetchData)) || fetchData.response;
                        break;
                    case 'error':
                        if (!fetchData.error)
                            continue;
                        fetchData.response = (await handler.func(fetchData)) || fetchData.response;
                        fetchData.error = null;
                        break;
                }
            }
            catch (err) {
                fetchData.error = err;
            }
        }
        if (fetchData.error)
            throw fetchData.error;
        return fetchData.response;
    }
    /**
     * Add a fetch listener and use this router to generate the response.
     */
    addFetchListener() {
        self.addEventListener('fetch', event => {
            event.respondWith(this.handle(event).then(r => r || fetch(event.request)));
        });
    }
}
function createMethodRoute(method) {
    function methodHandler(firstItem, ...items) {
        const router = new Router();
        router.add(ifMethod(method));
        router.all(...items);
        this.add(router);
    }
    return methodHandler;
}
Router.prototype.get = createMethodRoute('GET');
Router.prototype.put = createMethodRoute('PUT');
Router.prototype.post = createMethodRoute('POST');
Router.prototype.delete = createMethodRoute('DELETE');
export default Router;
