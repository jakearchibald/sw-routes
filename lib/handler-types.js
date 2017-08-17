/**
 * Handler called if no previous handler has provided a response.
 */
export function requestHandler(func) {
    return {
        func,
        type: 'request'
    };
}
/**
 * Handler called if a previous handler has provided a response.
 */
export function responseHandler(func) {
    return {
        func,
        type: 'response'
    };
}
/**
 * Handler always called.
 */
export function anyHandler(func) {
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
export function responseWaitUntilHandler(waitUntilFunc) {
    return {
        func(fetchData) {
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
export function waitUntilHandler(waitUntilFunc) {
    return {
        func(fetchData) {
            fetchData.waitUntil(waitUntilFunc(fetchData));
        },
        type: 'any'
    };
}
/**
 * Handler called if previous handler threw/rejected. The error is cleared unless this handler also throws.
 */
export function errorHandler(func) {
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
export function conditionalHandler(func) {
    return {
        func,
        type: 'conditional'
    };
}
