import env from "@/env.js";

import bootstrap from "./app/app.js";

const app = bootstrap();

const server = Bun.serve({
    port: env.PORT || 3000,
    fetch: app.fetch,
});

// eslint-disable-next-line no-console
console.log(`Listening on ${server.url}`);