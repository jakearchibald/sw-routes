/**
 * Handler that returns a (promise for a) response, or null.
 */
export type PotentialResponseHandler = (fetchDetails: any) => Promise<Response | void> | Response | void;
/**
 * Handler that returns nothing.
 */
export type VoidHandler = (fetchDetails: any) => Promise<void> | void;
export type BooleanHandler = (fetchDetails: any) => Promise<boolean> | boolean;

export interface HandlerDefinition {
  type: 'request' | 'response' | 'error',
  handler: PotentialResponseHandler
}

export interface VoidHandlerDefinition {
  type: 'finally' | 'response',
  handler: VoidHandler
}

export interface ConditionalHandlerDefinition {
  type: 'conditional',
  handler: BooleanHandler
}

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
    handler(fetchDetails: any): void {
      fetchDetails.waitUntil(handler(fetchDetails));
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
    handler(fetchDetails: any): void {
      fetchDetails.waitUntil(handler(fetchDetails));
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
