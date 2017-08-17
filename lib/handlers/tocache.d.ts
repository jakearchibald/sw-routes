import { ResponseHandler } from '../handler-types';
/**
 * Add response to the cache (unless it came from the cache).
 *
 * @param cacheName
 */
export default function toCache(cacheName: string): ResponseHandler;
