import { Scalar } from "@scalar/hono-api-reference";

import type { APPOpenAPI } from "./types.js";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: APPOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Auth Api",
    },
  });

  app.get(
    "/reference",
    Scalar((_) => {
      return {
        url: "/doc",
        theme: "kepler",
      };
    }),
  );
};
