import { test } from "./controllers/test.controller";

const server = Bun.serve({
    port: 3001,
    routes: {
        '/':req => test(req),
    }
})

console.log(`Listening on server ${server.url}`);