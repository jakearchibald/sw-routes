import isUrl from './handlers/isurl';
import isMethod from './handlers/ismethod';
import { requestHandler } from './handler-types';

function fetchEventToData(fetchEvent) {
  const fetchData = {
    url: new URL(fetchEvent.request.url),
    response: null,
    error: null
  };

  const fetchEventProps = [
    'request', 'preloadResponse', 'clientId'
  ];

  for (const prop of fetchEventProps) {
    fetchData[prop] = fetchEvent[prop];
  }

  // TODO: use waitUntil polyfill
  fetchData.waitUntil = fetchEvent.waitUntil.bind(fetchEvent);

  return fetchData;
}

export default class Router {
  constructor() {
    this._items = [];
  }
  add(...items) {
    this._items.push(...items.map(item => {
      if (typeof item == 'function') return requestHandler(item);
      return item;
    }));
  }
  all(...items) {
    const router = new Router();

    // Has a particular origin been specified?
    if (typeof items[0] == 'string') {
      router.add(isUrl(items[0]));
      items.shift();
    }

    router.add(...items);
    this.add(router);
  }
  async handle(fetchData) {
    if (fetchData instanceof FetchEvent) {
      fetchData = fetchEventToData(fetchData);
    }

    for (const item of this._items) {
      try {
        // Handle nested routers
        if (item instanceof Router) {
          fetchData.response = (await item.handle(fetchData)) || fetchData.response;
          fetchData.error = null;
          continue;
        }

        const {type, handler} = item;

        switch (type) {
          case 'finally':
            await handler(fetchData);
            break;
          case 'conditional':
            if (fetchData.error) continue;
            if (await handler(fetchData) == false) return fetchData.response;
            break;
          case 'request':
            if (fetchData.response || fetchData.error) continue;
            fetchData.response = await handler(fetchData);
            break;
          case 'response':
            if (fetchData.error || !fetchData.response) continue;
            fetchData.response = (await handler(fetchData)) || fetchData.response;
            break;
          case 'error':
            if (!fetchData.error) continue;
            fetchData.response = (await handler(fetchData)) || fetchData.response;
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
  addFetchListener() {
    self.addEventListener('fetch', event => {
      event.respondWith(this.handle(event).then(r => r || fetch(event.request)));
    });
  }
}

for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
  Object.defineProperty(Router.prototype, method.toLowerCase(), {
    value(...items) {
      const router = new Router();
      router.add(isMethod(method));
      router.all(...items);
      this.add(router);
    }
  })
}
