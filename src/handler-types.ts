import { FetchData, FetchDataWithResponse, FetchDataWithError } from '.';

export type ResolveTo<T> = Promise<T> | T;
export type CanResolveTo<T> = ResolveTo<T | void | null>;

export type ResponseProvider = (fetchData: FetchData) => CanResolveTo<Response>;
export type ResponseReplacer = (fetchData: FetchDataWithResponse) => CanResolveTo<Response>;
export type ErrorHandlerFunc = (fetchData: FetchDataWithError) => CanResolveTo<Response>;
export type VoidFunc = (fetchData: FetchData) => ResolveTo<void>;
export type VoidFuncWithResponse = (fetchData: FetchDataWithResponse) => ResolveTo<void>;
export type ConditionalHandlerFunc = (fetchData: FetchData) => Promise<boolean> | boolean;

export interface RequestHandler {
  type: 'request';
  func: ResponseProvider;
}

export interface ResponseHandler {
  type: 'response';
  func: ResponseReplacer;
}

export interface ErrorHandler {
  type: 'error';
  func: ErrorHandlerFunc;
}

export interface AnyHandler {
  type: 'any';
  func: ResponseProvider;
}

export interface ConditionalHandler {
  type: 'conditional';
  func: ConditionalHandlerFunc;
}

export type AllHandlers = RequestHandler | ResponseHandler | ErrorHandler | AnyHandler | ConditionalHandler;

/**
 * Handler called if no previous handler has provided a response.
 */
export function requestHandler(func: ResponseProvider): RequestHandler {
  return {
    func,
    type: 'request'
  };
}

/**
 * Handler called if a previous handler has provided a response.
 */
export function responseHandler(func: ResponseReplacer): ResponseHandler {
  return {
    func,
    type: 'response'
  };
}

/**
 * Handler always called.
 */
export function anyHandler(func: ResponseProvider): AnyHandler {
  return {
    func,
    type: 'any'
  };
}

/**
 * Handler called if a previous handler has provided a response.
 *
 * @param waitUntilFunc Returned promise passed to fetchEvent.waitUntil.
 */
export function responseWaitUntilHandler(waitUntilFunc: VoidFuncWithResponse): ResponseHandler {
  return {
    func(fetchData: FetchDataWithResponse): void {
      fetchData.waitUntil(waitUntilFunc(fetchData));
    },
    type: 'response'
  };
}

/**
 * Handler always called.
 *
 * @param waitUntilFunc Returned promise passed to fetchEvent.waitUntil.
 */
export function waitUntilHandler(waitUntilFunc: VoidFunc): AnyHandler {
  return {
    func(fetchData: FetchData): void {
      fetchData.waitUntil(waitUntilFunc(fetchData));
    },
    type: 'any'
  };
}

/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export function errorHandler(func: ResponseProvider): ErrorHandler {
  return {
    func,
    type: 'error'
  };
}

/**
 * Handler called unless previous handler threw/rejected.
 *
 * @param func If the handler returns false, subsequent handlers in this sub-router will be skipped.
 */
export function conditionalHandler(func: ConditionalHandlerFunc): ConditionalHandler {
  return {
    func,
    type: 'conditional'
  };
}
