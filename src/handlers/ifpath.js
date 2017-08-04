import pathToRegexp from 'path-to-regexp';

import { conditionalHandler } from '../handler-types.js';

export default function ifPath(path) {
  const keys = [];
  const re = pathToRegexp(path, keys, {
    strict: true,
    sensitive: true,
  });

  return conditionalHandler(fetchResults => {
    const results = re.exec(fetchResults.url.pathname);
    if (!results) return false;
    if (!fetchResults.params) fetchResults.params = {};
    results.slice(1).forEach((result, i) => {
      fetchResults.params[keys[i].name] = result;
    });
    return true;
  });
}
