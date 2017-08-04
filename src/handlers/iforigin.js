import { conditionalHandler } from '../handler-types.js';

export default function ifOrigin(origin) {
  return conditionalHandler(({ url }) => url.origin === origin);
}
