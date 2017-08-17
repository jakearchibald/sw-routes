import { FetchData, FetchDataWithResponse, FetchDataWithError } from '.';
export declare type ResolveTo<T> = Promise<T> | T;
export declare type CanResolveTo<T> = ResolveTo<T | void | null>;
export declare type ResponseProvider = (fetchData: FetchData) => CanResolveTo<Response>;
export declare type ResponseReplacer = (fetchData: FetchDataWithResponse) => CanResolveTo<Response>;
export declare type ErrorHandlerFunc = (fetchData: FetchDataWithError) => CanResolveTo<Response>;
export declare type VoidFunc = (fetchData: FetchData) => ResolveTo<void>;
export declare type VoidFuncWithResponse = (fetchData: FetchDataWithResponse) => ResolveTo<void>;
export declare type ConditionalHandlerFunc = (fetchData: FetchData) => Promise<boolean> | boolean;
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
export declare type AllHandlers = RequestHandler | ResponseHandler | ErrorHandler | AnyHandler | ConditionalHandler;
/**
 * Handler called if no previous handler has provided a response.
 */
export declare function requestHandler(func: ResponseProvider): RequestHandler;
/**
 * Handler called if a previous handler has provided a response.
 */
export declare function responseHandler(func: ResponseReplacer): ResponseHandler;
/**
 * Handler always called.
 */
export declare function anyHandler(func: ResponseProvider): AnyHandler;
/**
 * Handler called if a previous handler has provided a response.
 *
 * @param waitUntilFunc Returned promise passed to fetchEvent.waitUntil.
 */
export declare function responseWaitUntilHandler(waitUntilFunc: VoidFuncWithResponse): ResponseHandler;
/**
 * Handler always called.
 *
 * @param waitUntilFunc Returned promise passed to fetchEvent.waitUntil.
 */
export declare function waitUntilHandler(waitUntilFunc: VoidFunc): AnyHandler;
/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export declare function errorHandler(func: ResponseProvider): ErrorHandler;
/**
 * Handler called unless previous handler threw/rejected.
 *
 * @param func If the handler returns false, subsequent handlers in this sub-router will be skipped.
 */
export declare function conditionalHandler(func: ConditionalHandlerFunc): ConditionalHandler;
