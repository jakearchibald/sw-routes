import { conditionalHandler, ConditionalHandlerDefinition } from '../handler-types';

/**
 * Continue with additional handlers if this is a navigation request.
 */
export default function ifNavigation() {
  return conditionalHandler(({ request }) => request.mode == 'navigate');
}
