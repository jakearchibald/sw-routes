import pathToRegexp from 'path-to-regexp';

import { conditionalHandler } from '../handler-types.js';

export default function isUrl(toMatch) {
  const keys = [];
  const re = pathToRegexp(toMatch, keys, {
    strict: true,
    sensitive: true,
  });

  return conditionalHandler(fetchResults => {
    const url = fetchResults.url;
    let toTest;

    if (typeof toMatch == 'string' && toMatch.startsWith('/')) {
      if (url.origin != location.origin) return false;
      toTest = url.pathname;
    }
    else {
      toTest = `${url.protocol}//${url.host}${url.pathname}`;
    }

    const results = re.exec(toTest);
    if (!results) return false;
    if (!fetchResults.params) fetchResults.params = {};
    results.slice(1).forEach((result, i) => {
      fetchResults.params[keys[i].name] = result;
    });
    return true;
  });
}
