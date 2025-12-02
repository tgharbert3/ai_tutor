import { test } from "./controllers/test.controller";

const server = Bun.serve({
    port: Bun.env.PORT || 0,
    routes: {
        '/':req => test(req),
    }
})

console.log(`Listening on server ${server.url}`);