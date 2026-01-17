import app from "@/app.js";
import env from "@/env.js";

import path from "node:path";

const currentDir = import.meta.dir; 


const authFolder = path.join(currentDir, ".."); 

const certPath = path.join(authFolder, "localhost+1.pem");
const keyPath = path.join(authFolder, "localhost+1-key.pem");

const server = Bun.serve({
  port: env.PORT || 3000,
  fetch: app.fetch,
  tls: {
    cert: Bun.file(certPath),
    key: Bun.file(keyPath),
  },
});

// eslint-disable-next-line no-console
console.log(`Listening on ${server.url}`);
