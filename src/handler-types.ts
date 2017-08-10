import { FetchData } from '.';

export type PotentialResponseHandler = (fetchData: FetchData) => Promise<Response | void> | Response | void;
export type VoidHandler = (fetchData: FetchData) => Promise<void> | void;
export type BooleanHandler = (fetchData: FetchData) => Promise<boolean> | boolean;

export interface HandlerDefinition {
  type: 'request' | 'response' | 'error';
  handler: PotentialResponseHandler;
}

export interface VoidHandlerDefinition {
  type: 'finally' | 'response';
  handler: VoidHandler;
}

export interface ConditionalHandlerDefinition {
  type: 'conditional';
  handler: BooleanHandler;
}

export type AnyHandlerDefinition = HandlerDefinition | VoidHandlerDefinition | ConditionalHandlerDefinition;

/**
 * Handler called if no previous handler has provided a response.
 */
export function requestHandler(handler: PotentialResponseHandler): HandlerDefinition {
  return {
    handler,
    type: 'request'
  };
}

/**
 * Handler called if a previous handler has provided a response.
 */
export function responseHandler(handler: PotentialResponseHandler): HandlerDefinition {
  return {
    handler,
    type: 'response'
  };
}

/**
 * Handler always called.
 */
export function finallyHandler(handler: VoidHandler): VoidHandlerDefinition {
  return {
    handler,
    type: 'finally'
  };
}

/**
 * Handler called if a previous handler has provided a response.
 *
 * @param handler Returned promise passed to fetchEvent.waitUntil.
 */
export function responseWaitUntilHandler(handler: VoidHandler): VoidHandlerDefinition {
  return {
    handler(fetchData: any): void {
      fetchData.waitUntil(handler(fetchData));
    },
    type: 'response'
  };
}

/**
 * Handler always called.
 *
 * @param handler Returned promise passed to fetchEvent.waitUntil.
 */
export function waitUntilHandler(handler: VoidHandler): VoidHandlerDefinition {
  return {
    handler(fetchData: any): void {
      fetchData.waitUntil(handler(fetchData));
    },
    type: 'finally'
  };
}

/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export function errorHandler(handler: PotentialResponseHandler): HandlerDefinition {
  return {
    handler,
    type: 'error'
  };
}

/**
 * Handler called unless previous handler threw/rejected.
 *
 * @param handler If the handler returns false, subsequent handlers in this sub-router will be skipped.
 */
export function conditionalHandler(handler: BooleanHandler): ConditionalHandlerDefinition {
  return {
    handler,
    type: 'conditional'
  };
}
