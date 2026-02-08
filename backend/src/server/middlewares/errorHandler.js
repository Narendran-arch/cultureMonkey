import { defineEventHandler, HTTPError } from 'h3';

export function errorHandler() {
  return defineEventHandler(async (event) => {
    try {
      return await event.context._next();
    } catch (err) {
      const isHttpError = HTTPError.isError(err);

      const statusCode = isHttpError && err.status
        ? err.status
        : 500;

      const statusText = isHttpError && err.statusText
        ? err.statusText
        : 'Internal Server Error';

      event.runtime.node.res.statusCode = statusCode;
      event.runtime.node.res.statusMessage = statusText;

      return {
        success: false,
        error: {
          message: statusText,
          ...(isHttpError && err.data ? { details: err.data } : {})
        }
      };
    }
  });
}
