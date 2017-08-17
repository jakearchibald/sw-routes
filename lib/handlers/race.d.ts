import { AnyHandler } from '../handler-types';
import { AnyRouteParam } from './..';
/**
 * Race handlers. First to provide a response wins.
 *
 * @param items
 */
export default function race(...items: AnyRouteParam[]): AnyHandler;
