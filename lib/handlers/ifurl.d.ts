import { ConditionalHandler } from '../handler-types';
/**
 * Continue with additional handlers if the request url matches this pattern.
 *
 * @param toMatch Express-style pattern to match
 */
export default function ifUrl(toMatch: string | RegExp): ConditionalHandler;
