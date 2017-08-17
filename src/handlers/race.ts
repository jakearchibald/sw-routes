import { anyHandler, AnyHandler } from '../handler-types';
import Router, { FetchData, AnyRouteParam } from './..';
import sequence from './sequence';

/**
 * Race handlers. First to provide a response wins.
 *
 * @param items
 */
export default function race(...items: AnyRouteParam[]) {
  const routers: Router[] = items.map(item => {
    if (item instanceof Router) return item;
    // Convert to router.
    return sequence(item);
  });

  return anyHandler(fetchData => {
    return new Promise((resolve, reject) => {
      // Resolve as soon as one returns a response.
      const responsePromises = routers.map(async router => {
        const dataClone = new FetchData(fetchData);
        const response = await router.handle(dataClone);
        if (response) resolve(response);
      });

      // Reject if one rejects.
      // Resolve with void if none respond with response.
      // The call to resolve() here will happen after any resolve(response) above.
      Promise.all(responsePromises).then(() => resolve(), reject);
    });
  });
}
