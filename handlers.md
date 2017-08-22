# Handlers

## `fromCache`

Try to get a response from a cache.

```js
fromCache();
fromCache(opts);
fromCache(request, opts);
```

* `request` – A specific `Request` or url to look for in the cache. Without this it uses the current request.
* `opts` – [Options passed to `caches.match`](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/match#Parameters).

For example, this tries to get a response from any cache, falling back to the network, falling back to a specific offline page:

```js
import { fromCache, fromNetwork } from 'sw-routers/handlers';

router.get(fromCache(), fromNetwork(), fromCache('/offline'));
```

## `fromNetwork`

Try to get a response from the network.

```js
fromNetwork();
fromNetwork({
  timeout
});
```

* Options:
    * `timeout` – Timeout in milliseconds.

For example, this tries to get a response from the network within two seconds, falling back to the cache:

```js
import { fromCache, fromNetwork } from 'sw-routers/handlers';

router.get(fromNetwork({ timeout: 2000 }), fromCache());
```

## `fromPreload`

Use any [preloaded response](https://developers.google.com/web/updates/2017/02/navigation-preload).

```js
fromPreload();
```

For example, this tries to get a preloaded response, falling back to a non-preloaded response from the network:

```js
import { fromPreload, fromNetwork } from 'sw-routers/handlers';

router.get(fromPreload(), fromNetwork());
```

## `ifMethod`

Only run subsequent handlers if the request uses a particular HTTP method. This is what `router.get` etc use internally.

```js
ifMethod(method);
```

* `method` – HTTP method.

For example, this looks for a response from the network if the request uses the made-up "HAPPY" method:

```js
import { ifMethod, fromNetwork } from 'sw-routers/handlers';

router.all(ifMethod('HAPPY'), fromNetwork());
```

## `ifNavigation`

Only run subsequent handlers if the request is a page navigation.

```js
ifNavigation();
```

For example, this looks for a match in the cache for navigation requests:

```js
import { ifNavigation, fromCache } from 'sw-routers/handlers';

router.get(ifNavigation(), fromCache());
```

## `ifUrl`

Only run subsequent handlers if the request matches a particular URL. If you pass a string as the first argument to `.get` etc, it's passed to this.

This uses the [same pattern system as express](http://expressjs.com/en/guide/routing.html#route-paths), and results are available in `fetchData.params`.

Routes that start `/` are assumed to be same-origin, otherwise you can match the full path (except the query string).

```js
ifUrl(pattern);
```

* `pattern` – A string or regular expression to match on.

For example, matching all articles pages on the same origin:

```js
router.get('/articles/:articleName/', fetchData => {
  console.log(fetchData.params.articleName);
});
```

## `race`

Race a number of handlers. First one to provide a response wins.

```js
race(...handlers);
```

* `handlers` – Handlers to race.

For example, racing the preload and cache:

```js
import { fromPreload, fromCache, race } from 'sw-routers/handlers';

router.get(race(fromPreload(), fromCache()));
```

## `sequence`

Shortcut for creating a sub-router. This is useful for creating nested routers within [`race`](#race).

```js
sequence(...handlers);
```

* `handlers` – Handlers to call.

For example, a fairly complex behaviour that:

* Fetches from the network and updates the cache.
* Responds from the network if it responds within a second, otherwise the cache.

```js
import {
  fromNetwork,
  fromCache,
  race,
  sequence,
  wait
} from 'sw-routers/handlers';

router.all(
  race(
    sequence(fromNetwork(), toCache('dynamic')),
    sequence(fromCache(), wait(1000))
  )
);
```

## `toCache`

Add the response to a cache. If the response was fetched from a cache (eg via [`fromCache`](#fromcache)), it won't re-add it to the cache.

```js
toCache(cacheName);
```

* `cacheName` – Name of the cache to add the response to.

For example, getting from the cache, falling back to the network, then adding to the cache. If the response comes from the cache, it won't add it again:

```js
import { fromCache, toCache, fromNetwork } from 'sw-routers/handlers';

router.get(fromCache(), fromNetwork(), toCache('dynamic'));
```

## `updateCache`

Add the response to a cache unless it came from a cache, in which case fetch a fresh copy instead.

```js
updateCache(cacheName);
```

* `cacheName` – Name of the cache to add the response to.

For example, get the item from the cache, falling back to the network, and either adding the network response to the cache, or fetch a fresh copy.

```js
import { fromCache, updateCache, fromNetwork } from 'sw-routers/handlers';

router.get(fromCache(), fromNetwork(), updateCache('dynamic'));
```

## `wait`

Add an artificial delay to the route. This is useful for creating timeouts in combination with [`sequence`](#sequence) and [`race`](#race).

```js
wait(ms);
```

* `ms` – Milliseconds to wait

See [`sequence`](#sequence) for a detailed example.

# Handler types

```js
import { conditionalHandler } from 'sw-routers/handler-types';

router.get(conditionalHandler(fetchData => {
  return fetchData.request.mode == 'no-cors';
}), fromNetwork());
```

`sw-routers/handler-types` exposes the following handler types, each takes a callback that receives [`FetchData`](README.md#fetchdata).

## `requestHandler`

Called if no previous handler has provided a response.

Use this to return a promise for a response (or null, if none can be provided).

If you pass a simple function to a router, it's treated as a request handler.

For example, here's a basic implementation of `fromNetwork`:

```js
import { requestHandler } from 'sw-routers/handler-types';

router.get(requestHandler(fetchData => {
  return fetch(fetchData.request).catch(() => null);
}));
```

## `responseHandler`

Called if a previous handler has provided a response.

Use this to return a promise for a different response (or null, to keep the current response).

For example, here's a response handler that reverses the response (for whatever reason):

```js
import { responseHandler } from 'sw-routers/handler-types';

router.get(fromNetwork(), responseHandler(async fetchData => {
  const text = await fetchData.response.text();
  const reversedText = [...text].reverse().join('');

  return new Response(reversedText, {
    headers: fetchData.response.headers
  });
}));
```

## `anyHandler`

Called whether a response has been provided or not.

You can return a promise for a response (or null, if none can be provided).

For example, here's a handler that provides a response if none has been provided, or the provided response is a 404:

```js
import { anyHandler } from 'sw-routers/handler-types';

router.get(fromNetwork(), anyHandler(async fetchData => {
  if (fetchData.response && fetchData.status != 404) return;

  return new Response("NO! Bad response!");
}));
```

## `responseWaitUntilHandler`

Called if a previous handler has provided a response, but runs asynchronously – it doesn't block the running of subsequent handlers, and doesn't delay the response reaching the page.

This is ideal for doing things with the response such as caching.

For example, here's a basic caching handler, similar to `toCache`:

```js
import { responseWaitUntilHandler } from 'sw-routers/handler-types';

router.get(responseWaitUntilHandler(async fetchData => {
  const responseClone = fetchData.response.clone();
  const cache = await caches.open('my-cache');

  await cache.put(fetchData.request, responseClone);
}));
```

**Remember to return a promise for async actions**, these will be used to keep the service worker awake.

## `waitUntilHandler`

Called whether a response has been provided or not, but runs asynchronously – it doesn't block the running of subsequent handlers, and doesn't delay any response reaching the page.

This is ideal for doing bookkeeping & clean-up work.

For example, this removes all but the 20 most-recent additions to a cache:

```js
import { waitUntilHandler } from 'sw-routers/handler-types';

router.get(waitUntilHandler(async () => {
  const cache = await caches.open('my-cache');
  const requests = await cache.keys();
  const requestsToRemove = requests.slice(0, -20);

  await Promise.all(
    requestsToRemove.map(r => cache.delete(r))
  );
}));
```

**Remember to return a promise for async actions**, these will be used to keep the service worker awake.

## `conditionalHandler`

Called whether a response has been provided or not. If this handler returns (a promise for) false, all subsequent handlers in the sequence are skipped.

For example, here's the implementation of `ifNavigation`:

```js
import { conditionalHandler } from 'sw-routers/handler-types';

router.get(conditionalHandler(async fetchData => {
  return fetchData.request.mode == 'navigate';
}), fromCache());
```

## `errorHandler`

Called if a previous handler threw an error (or returned a rejected promise). This "catches" the error, unless the error handler also throws.

You can return a promise for a response (or null, if none can be provided).

For example, this can be used to display an error page:

```js
import { errorHandler } from 'sw-routers/handler-types';

router.get(...otherHandlers, errorHandler(async fetchData => {
  return new Response(`Oh no, there was an error: ${fetchData.error.name}`);
}));
```
