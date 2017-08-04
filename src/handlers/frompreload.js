import { requestHandler } from '../handler-types.js';

export default function fromNetwork() {
  return requestHandler(({ preloadResponse }) => preloadResponse);
}
