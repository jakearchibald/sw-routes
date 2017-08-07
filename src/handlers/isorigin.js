import pathToRegexp from 'path-to-regexp';

import { conditionalHandler } from '../handler-types.js';

export default function isOrigin(origin) {
  const keys = [];
  const re = pathToRegexp(origin, keys, {
    strict: true,
    sensitive: true,
  });

  return conditionalHandler(fetchResults => {
    const results = re.exec(fetchResults.url.origin);
    if (!results) return false;
    if (!fetchResults.params) fetchResults.params = {};
    results.slice(1).forEach((result, i) => {
      fetchResults.params[keys[i].name] = result;
    });
    return true;
  });
}
