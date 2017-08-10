import { FetchData, FetchDataWithResponse, FetchDataWithError } from '.';
export declare type PotentialResponseHandler = (fetchData: FetchData) => Promise<Response | void> | Response | void;
export declare type PotentialResponseHandlerWithResponse = (fetchData: FetchDataWithResponse) => Promise<Response | void> | Response | void;
export declare type PotentialResponseHandlerWithError = (fetchData: FetchDataWithError) => Promise<Response | void> | Response | void;
export declare type VoidHandler = (fetchData: FetchData) => Promise<void> | void;
export declare type VoidHandlerWithResponse = (fetchData: FetchDataWithResponse) => Promise<void> | void;
export declare type BooleanHandler = (fetchData: FetchData) => Promise<boolean> | boolean;
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
export declare type AnyHandlerDefinition = HandlerDefinition | ResponseHandlerDefinition | ErrorHandlerDefinition | VoidHandlerDefinition | ConditionalHandlerDefinition;
/**
 * Handler called if no previous handler has provided a response.
 */
export declare function requestHandler(handler: PotentialResponseHandler): HandlerDefinition;
/**
 * Handler called if a previous handler has provided a response.
 */
export declare function responseHandler(handler: PotentialResponseHandlerWithResponse): ResponseHandlerDefinition;
/**
 * Handler always called.
 */
export declare function finallyHandler(handler: VoidHandler): VoidHandlerDefinition;
/**
 * Handler called if a previous handler has provided a response.
 *
 * @param handler Returned promise passed to fetchEvent.waitUntil.
 */
export declare function responseWaitUntilHandler(handler: VoidHandlerWithResponse): ResponseHandlerDefinition;
/**
 * Handler always called.
 *
 * @param handler Returned promise passed to fetchEvent.waitUntil.
 */
export declare function waitUntilHandler(handler: VoidHandler): VoidHandlerDefinition;
/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export declare function errorHandler(handler: PotentialResponseHandlerWithError): ErrorHandlerDefinition;
/**
 * Handler called unless previous handler threw/rejected.
 *
 * @param handler If the handler returns false, subsequent handlers in this sub-router will be skipped.
 */
export declare function conditionalHandler(handler: BooleanHandler): ConditionalHandlerDefinition;
