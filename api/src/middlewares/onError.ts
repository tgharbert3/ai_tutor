/**
 * This on Error handler is apart of the Stoker library from W3CJ.
 * https://github.com/w3cj/stoker/blob/main/src/middlewares/on-error.ts
 */

import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== 200
    ? (currentStatus as ContentfulStatusCode)
    : 500;

  const env = c.env?.NODE_ENV || Bun.env?.NODE_ENV;
  return c.json(
    {
      message: err.message,

      stack: env === "production"
        ? undefined
        : err.stack,
    },
    statusCode,
  );
};

export default onError;
