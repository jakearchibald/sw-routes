import { AnyHandlerDefinition, PotentialResponseHandler } from './handler-types';
export declare class FetchData {
    request: Request;
    preloadResponse: Promise<Response | void>;
    clientId: string | null;
    /**
     * Parsed request url.
     */
    url: URL;
    /**
     * Error thrown by previous handler.
     */
    error: Error | null;
    /**
     * Response provided by previous handler.
     */
    response: Response | null;
    /**
     * Params added by ifUrl.
     */
    params: {
        [x: number]: string;
        [x: string]: string;
    };
    /**
     * Inform the service worker about additional work.
     */
    waitUntil: (p: Promise<void> | void) => void;
    [x: string]: any;
    constructor(event: FetchEvent);
}
export interface FetchDataWithResponse extends FetchData {
    response: Response;
}
export interface FetchDataWithError extends FetchData {
    error: Error;
}
declare class Router {
    private _items;
    /**
     * Add items to this router.
     *
     * @param items Request/response/conditional/error handlers, or sub-routers.
     */
    add(...items: AnyRouteParam[]): void;
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
    /**
     * Handle a particular fetch event.
     *
     * This allows you to get a result from this router without having it take over your whole fetch event.
     */
    handle(fetchData: (FetchEvent | FetchData)): Promise<Response | null>;
    /**
     * Add a fetch listener and use this router to generate the response.
     */
    addFetchListener(): void;
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
export default Router;
export declare type AnyRouteParam = AnyHandlerDefinition | Router | PotentialResponseHandler;
