import express from "express";
import router, { swagger } from "./router";
import defaults from "./router/defaults";

const server = templates => {
  const app = express();
  app.use(defaults());

  if (templates) {
    app.use("/api", router(templates));
    app.use("/docs", swagger(templates, "/api"));
  }
  return app;
};

export default server;

export { server, router };
