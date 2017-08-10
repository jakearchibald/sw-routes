import { VoidHandlerDefinition } from '../handler-types';
/**
 * Add response to the cache, unless it came from the cache, in which case fetch an updated version and cache it.
 *
 * @param cacheName
 */
export default function updateCache(cacheName: string): VoidHandlerDefinition;
