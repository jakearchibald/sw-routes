/**
 * Handler called if no previous handler has provided a response.
 */
export function requestHandler(handler) {
    return {
        handler,
        type: 'request'
    };
}
/**
 * Handler called if a previous handler has provided a response.
 */
export function responseHandler(handler) {
    return {
        handler,
        type: 'response'
    };
}
/**
 * Handler always called.
 */
export function finallyHandler(handler) {
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
export function responseWaitUntilHandler(handler) {
    return {
        handler(fetchData) {
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
export function waitUntilHandler(handler) {
    return {
        handler(fetchData) {
            fetchData.waitUntil(handler(fetchData));
        },
        type: 'finally'
    };
}
/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export function errorHandler(handler) {
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
export function conditionalHandler(handler) {
    return {
        handler,
        type: 'conditional'
    };
}
