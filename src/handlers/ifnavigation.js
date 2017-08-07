import { conditionalHandler } from '../handler-types.js';

export default function ifNavigation() {
  return conditionalHandler(({ request }) => request.mode === 'navigation');
}
