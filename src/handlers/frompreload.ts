import { requestHandler, HandlerDefinition } from '../handler-types';

/**
 * Use preloaded response as the response.
 */
export default function fromNetwork() {
  return requestHandler(({ preloadResponse }) => preloadResponse);
}
