import ifUrl from './handlers/ifurl';
import ifMethod from './handlers/ifmethod';
import {
  requestHandler,
  AnyHandlerDefinition,
  PotentialResponseHandler
} from './handler-types';

export class FetchData {
  request: Request;
  preloadResponse: Promise<Response | void>;
  clientId: string;
  /**
   * Parsed request url.
   */
  url: URL;
  /**
   * Error thrown by previous handler.
   */
  error: Error;
  /**
   * Response provided by previous handler.
   */
  response: Response;
  /**
   * Params added by ifUrl.
   */
  params: {
    [x: number]: string;
    [x: string]: string;
  }
  /**
   * Inform the service worker about additional work.
   */
  waitUntil: (p: Promise<void>) => void;

  // Allow additional properties
  [x: string]: any;

  constructor(event: FetchEvent) {
    this.request = event.request;
    this.preloadResponse = event.preloadResponse;
    this.clientId = event.clientId;
    this.url = new URL(event.request.url);
    this.waitUntil = event.waitUntil.bind(event);
  }
}

class Router {
  private _items: (AnyHandlerDefinition | Router)[] = [];

  /**
   * Add items to this router.
   *
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  add(...items: AnyRouteParam[]) {
    this._items.push(...items.map(item => {
      if (typeof item == 'function') return requestHandler(item);
      return item;
    }));
  }

  /**
   * Create a sub-router for all HTTP methods.
   *
   * @param urlPattern Express-like URL pattern.
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  all(urlPattern: string, ...items: AnyRouteParam[]): void;
  /**
   * Create a sub-router for all HTTP methods.
   *
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  all(...items: AnyRouteParam[]): void;
  all(firstItem: (AnyRouteParam | string), ...items: AnyRouteParam[]) {
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
  async handle(fetchData: (FetchEvent | FetchData)) {
    if (fetchData instanceof FetchEvent) {
      fetchData = new FetchData(fetchData);
    }

    for (const item of this._items) {
      try {
        // Handle nested routers
        if (item instanceof Router) {
          fetchData.response = (await item.handle(fetchData)) || fetchData.response;
          fetchData.error = null;
          continue;
        }

        switch (item.type) {
          case 'finally':
            await item.handler(fetchData);
            break;
          case 'conditional':
            if (fetchData.error) continue;
            if (await item.handler(fetchData) == false) return fetchData.response;
            break;
          case 'request':
            if (fetchData.response || fetchData.error) continue;
            fetchData.response = await item.handler(fetchData) || null;
            break;
          case 'response':
            if (fetchData.error || !fetchData.response) continue;
            fetchData.response = (await item.handler(fetchData)) || fetchData.response;
            break;
          case 'error':
            if (!fetchData.error) continue;
            fetchData.response = (await item.handler(fetchData)) || fetchData.response;
            fetchData.error = null;
            break;
        }
      }
      catch (err) {
        fetchData.error = err;
      }
    }

    if (fetchData.error) throw fetchData.error;

    return fetchData.response;
  }

  /**
   * Add a fetch listener and use this router to generate the response.
   */
  addFetchListener() {
    (<ServiceWorkerGlobalScope>self).addEventListener('fetch', event => {
      event.respondWith(this.handle(event).then(r => r || fetch(event.request)));
    });
  }
}

interface Router {
  /**
   * Create a sub-router that handles only GET requests.
   *
   * @param urlPattern Express-like URL pattern.
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  get(urlPattern: string, ...items: AnyRouteParam[]): void;
  /**
   * Create a sub-router that handles only GET requests.
   *
   * @param urlPattern Express-like URL pattern.
   */
  get(...items: AnyRouteParam[]): void;

  /**
   * Create a sub-router that handles only POST requests.
   *
   * @param urlPattern Express-like URL pattern.
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  post(urlPattern: string, ...items: AnyRouteParam[]): void;
  /**
   * Create a sub-router that handles only POST requests.
   *
   * @param urlPattern Express-like URL pattern.
   */
  post(...items: AnyRouteParam[]): void;

  /**
   * Create a sub-router that handles only PUT requests.
   *
   * @param urlPattern Express-like URL pattern.
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  put(urlPattern: string, ...items: AnyRouteParam[]): void;
  /**
   * Create a sub-router that handles only PUT requests.
   *
   * @param urlPattern Express-like URL pattern.
   */
  put(...items: AnyRouteParam[]): void;

  /**
   * Create a sub-router that handles only DELETE requests.
   *
   * @param urlPattern Express-like URL pattern.
   * @param items Request/response/conditional/error handlers, or sub-routers.
   */
  delete(urlPattern: string, ...items: AnyRouteParam[]): void;
  /**
   * Create a sub-router that handles only DELETE requests.
   *
   * @param urlPattern Express-like URL pattern.
   */
  delete(...items: AnyRouteParam[]): void;
}

for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
  Router.prototype[method.toLowerCase()] = function (...items) {
    const router = new Router();
    router.add(ifMethod(method));
    router.all(...items);
    this.add(router);
  };
}

export default Router;
export type AnyRouteParam = AnyHandlerDefinition | Router | PotentialResponseHandler;
