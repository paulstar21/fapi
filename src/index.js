import express from "express";
import bodyParser from "body-parser";
import router from "./router";
import defaults from "./router/defaults";

export default function(templates) {
  const app = express();
  app.use(bodyParser.json());
  if (templates) {
    app.use("/api", router(templates));
  }
  return app;
}

export { router };
