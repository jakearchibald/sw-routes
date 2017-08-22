# sw-routes

A basic router for service worker fetch events.

```sh
npm install sw-routes
```

This library is designed to be used with an ES6-aware bundler like [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/), but there's also [a prebuilt version](#prebuilt-version).

## Guide

### Creating a router

```js
import Router from 'sw-routes';

const router = new Router();

// Add your routes

router.addFetchListener();
```

If you don't want sw-routes to write the fetch listener for you, see [`router.handle`](#router-handle).

### Adding routes

Routes are created using:

```js
router.get(path, ...handlers);
// or
router.get(...handlers);
```

`.get` only handles `GET` requests. There is also `.post`, `.put`, `.delete` for other HTTP methods, and `.all` for all methods.

Paths can contain [regex & patterns](handlers.md#ifUrl).

In their simplest form, handlers are just functions:

```js
router.get('/whatever/', async fetchData => {
  try {
    const response = await fetch(fetchData.request);
    if (!response.ok) throw Error('Not ok');
    return response;
  }
  catch (err) {
    return caches.match('/error-page');
  }
});
```

Functions are "request handlers", and are called in sequence until one provides a response, or a promise for a response (as above).

For details on `fetchData`, see the [API docs](#FetchData).

### Handlers

sw-routes provides many common handlers. For instance, if you wanted to respond from the cache, falling back to the network:

```js
import { fromCache, fromNetwork } from 'sw-routes/handlers';

router.get(fromCache(), fromNetwork());
```

If you want to respond from the network, falling back to the cache, just flip the handlers around:

```js
router.get(fromNetwork(), fromCache());
```

Here are all the handlers sw-routes provides:

* [`fromCache`](handlers.md#fromCache) – Try to get a response from a cache. It can be a specific item, or one that matches the current request.
* [`fromNetwork`](handlers.md#fromNetwork) – Try to get a response from the network.
* [`fromPreload`](handlers.md#fromPreload) – Use any [preloaded response](https://developers.google.com/web/updates/2017/02/navigation-preload).
* [`ifMethod`](handlers.md#ifMethod) – Only run subsequent handlers if the request uses a particular HTTP method. This is what `.get` etc use internally.
* [`ifNavigation`](handlers.md#ifNavigation) –  Only run subsequent handlers if the request is a page navigation.
* [`ifUrl`](handlers.md#ifUrl) – Only run subsequent handlers if the request matches a particular URL. If you pass a string as the first argument to `.get` etc, it's passed to this.
* [`race`](handlers.md#race) – Race a number of handlers. First one to provide a response wins.
* [`sequence`](handlers.md#sequence) – Shortcut for creating a sub-router.
* [`toCache`](handlers.md#toCache) – Add the response to a cache (unless it came from the cache).
* [`updateCache`](handlers.md#updateCache) – Add the response to a cache. If it came from the cache, fetch a fresh copy instead.
* [`wait`](handlers.md#wait) – Add an artificial delay. This is useful for creating timeouts.

### Writing your own handler

When creating handlers, bare functions are "request handlers", but there are other types, such as "conditional handlers":

```js
import { conditionalHandler } from 'sw-routers/handler-types';

router.get(conditionalHandler(data => {
  return data.request.mode == 'no-cors';
}), fromNetwork());
```

Here are all the types:

* [`requestHandler`](handlers.md#requestHandler) – Called if a response hasn't been provided yet. Can return a response.
* [`responseHandler`](handlers.md#responseHandler) – Called if a response *has* been provided. Can return a different response.
* [`anyHandler`](handlers.md#anyHandler) – Called whether a response has been provided or not. Can return a response.
* [`responseWaitUntilHandler`](handlers.md#responseWaitUntilHandler) – Called if a response has been provided. Runs asynchronously. Useful for doing something with the response such as caching.
* [`waitUntilHandler`](handlers.md#waitUntilHandler) – Called whether a response has been provided or not. Runs asynchronously. Useful for doing bookkeeping & clean-up work.
* [`conditionalHandler`](handlers.md#conditionalHandler) – Skips subsequent handlers in the sequence if it returns false.
* [`errorHandler`](handlers.md#errorHandler) – Called if a previous handler threw an error or rejected.

## API

### `Router`

```js
import Router from 'sw-routes';
const router = new Router();
```

#### `router.any/get/post/put/delete`

Create and add a sub-router with handlers.

```js
router.get(urlPattern, ...items);
router.get(...items);
```

* `urlPattern`: Becomes a conditional handler using [`ifUrl`](handlers.md#ifUrl).
* `items`: One or more handlers or sub-routers.

`any` handles requests of all HTTP methods, whereas `get` etc handle requests of specific HTTP methods.

#### `router.add`

Add items to the current router. This is useful for adding catch-all handlers.

```js
router.add(...items);
```

* `items`: One or more handlers.

#### `router.addFetchListener`

Adds a fetch listener which uses the router to handle fetches.

```js
router.addFetchListener();
```

#### `router.handle`

Process a fetch event and return a response.

```js
const response = await router.handle(data);
```

* `data` - a [`FetchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent) or [`FetchData`](#FetchData) object.

This is useful if you need to add your own fetch event logic around the router:

```js
addEventListener('fetch', event => {
  // Your code goes here.
  event.respondWith(async function() {
    // Maybe more of your own code?
    const response = await router.handle(event);
    // Some more of your own code, perhaps?
    return response; // or maybe something else!
  }());
});
```

### `FetchData`

An instance of `FetchData` is given to each handler.

Its has the following properties from the [fetch event](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent).

* `request`
* `preloadResponse`
* `clientId`
* `waitUntil`

But also:

* `url`: A parsed version of request's URL.
* `error`: The error thrown by a previous handler.
* `response`: The response provided by a previous handler.
* `params`: Params from the [URL match](handlers.md#isUrl).

## Prebuilt version

[dist/index.js](dist/index.js).

`Router` is exposed on the global. Handlers are exposed as `Router.handlers`, and handler types are exposed as `Router.handlerTypes`.
