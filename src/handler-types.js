export function requestHandler(handler) {
  return {
    handler,
    type: 'request'
  };
}

export function responseHandler(handler) {
  return {
    handler,
    type: 'response'
  };
}

export function responseWaitUntilHandler(waitUntilHandler) {
  return {
    handler(fetchDetails) {
      fetchDetails.waitUntil(waitUntilHandler(fetchDetails));
    },
    type: 'response'
  };
}

export function errorHandler(handler) {
  return {
    handler,
    type: 'error'
  };
}

export function conditionalHandler(handler) {
  return {
    handler,
    type: 'conditional'
  };
}
