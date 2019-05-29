import express from "express";
import swaggerUi from "swagger-ui-express";
import pathToRegexp from "path-to-regexp";
import { initializeTemplates } from "./router";

function extractParamsFromPath(path) {
  const pathKeys = [];
  let pathRegex = pathToRegexp(path, pathKeys);
  return pathKeys;
}

export default function(templates, rootPath) {
  const initializedTemplates = initializeTemplates(templates);

  const swaggerSpec = {
    swagger: "2.0",
    info: {
      title: "fapi",
      description: "",
      version: "1.0"
    },
    produces: ["application/json"]
  };

  let paths = Object.keys(initializedTemplates).reduce((paths, key) => {
    templates = initializedTemplates[key];

    templates.forEach(template => {
      const pathParams = extractParamsFromPath(template.req.path);

      const path = pathParams.reduce((newPath, param) => {
        let paramRegex = new RegExp(`:${param.name}(\\(.+\\))?`);
        return newPath.replace(paramRegex, `{${param.name}}`);
      }, template.req.path);

      let swaggerPath = `${rootPath || ""}/${key}${path}`;

      const swaggerPathParams = pathParams.map(key => {
        let paramRegex = new RegExp(`:${key.name}(\\(.+\\))?`);
        swaggerPath = swaggerPath.replace(paramRegex, `{${key.name}}`);
        return {
          in: "path",
          name: key.name
        };
      });

      const swaggerQueryParams = template.req.query
        ? Object.keys(template.req.query).map(key => {
            return {
              in: "query",
              name: key
            };
          })
        : [];

      const pathObj = paths[swaggerPath] || {};
      pathObj[template.req.method] = {
        tags: [swaggerPath],
        description: "",
        parameters: [...swaggerPathParams, ...swaggerQueryParams],
        responses: {}
      };
      paths[swaggerPath] = pathObj;
    });

    return paths;
  }, {});

  swaggerSpec["paths"] = paths;

  const router = express.Router();
  router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return router;
}
