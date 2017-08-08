import { conditionalHandler, ConditionalHandlerDefinition } from '../handler-types';

/**
 * Continue with additional handlers if the request's method matches.
 *
 * @param method An HTTP method.
 */
export default function ifMethod(method: string) {
  return conditionalHandler(({ request }) => request.method === method);
}
