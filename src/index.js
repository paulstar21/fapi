import express from "express";
import router from "./router";
import defaults from "./router/defaults";

export default function(templates) {
  const app = express();
  app.use(defaults);
  if (templates) {
    app.use("/api", router(templates));
  }
  return app;
}

export { router };
