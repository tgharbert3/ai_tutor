import app from "@/app.js";

const server = Bun.serve({
  port: Bun.env.PORT || 3000,
  fetch: app.fetch,
});

// eslint-disable-next-line no-console
console.log(`Listening on ${server.url}`);
