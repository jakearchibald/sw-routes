import { conditionalHandler } from '../handler-types';
/**
 * Continue with additional handlers if the request's method matches.
 *
 * @param method An HTTP method.
 */
export default function ifMethod(method) {
    return conditionalHandler(({ request }) => request.method === method);
}
