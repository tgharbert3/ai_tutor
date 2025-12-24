import env from "@/env";

import app from "@/app.js";

const server = Bun.serve({
  port: env.PORT || 3000,
  fetch: app.fetch,
});

// eslint-disable-next-line no-console
console.log(`Listening on ${server.url}`);
