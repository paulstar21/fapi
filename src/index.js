import express from "express";
import bodyParser from "body-parser";
import router from "./routes/router";

export default function(templates) {
  const app = express();
  app.use(bodyParser.json());
  if (templates) {
    app.use("/api", router(templates));
  }

  app.use(bodyParser.json());
  return app;
}

export { router };
