import { conditionalHandler } from '../handler-types.js';

export default function isMethod(method) {
  return conditionalHandler(({ request }) => request.method === method);
}
