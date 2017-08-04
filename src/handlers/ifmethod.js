import { conditionalHandler } from '../handler-types.js';

export default function ifMethod(method) {
  return conditionalHandler(({ request }) => request.method === method);
}
