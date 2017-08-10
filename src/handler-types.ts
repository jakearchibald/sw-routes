import { FetchData, FetchDataWithResponse, FetchDataWithError } from '.';

export type PotentialResponseHandler = (fetchData: FetchData) => Promise<Response | void> | Response | void;
export type PotentialResponseHandlerWithResponse = (fetchData: FetchDataWithResponse) => Promise<Response | void> | Response | void;
export type PotentialResponseHandlerWithError = (fetchData: FetchDataWithError) => Promise<Response | void> | Response | void;
export type VoidHandler = (fetchData: FetchData) => Promise<void> | void;
export type VoidHandlerWithResponse = (fetchData: FetchDataWithResponse) => Promise<void> | void;
export type BooleanHandler = (fetchData: FetchData) => Promise<boolean> | boolean;

export interface HandlerDefinition {
  type: 'request';
  handler: PotentialResponseHandler;
}

export interface ResponseHandlerDefinition {
  type: 'response';
  handler: PotentialResponseHandlerWithResponse;
}

export interface ErrorHandlerDefinition {
  type: 'error';
  handler: PotentialResponseHandlerWithError;
}

export interface VoidHandlerDefinition {
  type: 'finally';
  handler: VoidHandler;
}

export interface ConditionalHandlerDefinition {
  type: 'conditional';
  handler: BooleanHandler;
}

export type AnyHandlerDefinition = HandlerDefinition | ResponseHandlerDefinition | ErrorHandlerDefinition | VoidHandlerDefinition | ConditionalHandlerDefinition;

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
export function responseHandler(handler: PotentialResponseHandlerWithResponse): ResponseHandlerDefinition {
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
export function responseWaitUntilHandler(handler: VoidHandlerWithResponse): ResponseHandlerDefinition {
  return {
    handler(fetchData: FetchDataWithResponse): void {
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
    handler(fetchData: FetchData): void {
      fetchData.waitUntil(handler(fetchData));
    },
    type: 'finally'
  };
}

/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export function errorHandler(handler: PotentialResponseHandlerWithError): ErrorHandlerDefinition {
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
