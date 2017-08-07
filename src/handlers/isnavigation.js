import { conditionalHandler } from '../handler-types.js';

export default function isNavigation() {
  return conditionalHandler(({ request }) => request.mode === 'navigation');
}
