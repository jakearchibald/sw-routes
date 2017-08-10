import { requestHandler } from '../handler-types';
/**
 * Use preloaded response as the response.
 */
export default function fromPreload() {
    return requestHandler(({ preloadResponse }) => preloadResponse);
}
