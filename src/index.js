import express from "express";
import router from "./router";
import { swagger } from "./router";
import defaults from "./router/defaults";
import _ from "lodash";

const server = templates => {
  enableSwagger: true
};

export default function(templates, options) {
  const ops = _.merge({}, defaultOptions, options);
  const app = express();
  app.use(defaults());

  if (templates) {
    app.use("/api", router(templates));
    if (ops.enableSwagger) {
      app.use("/api-docs", swagger(templates, "/api"));
    }
  }
  return app;
};

export default server;

export { server, router };
