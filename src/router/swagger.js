import express from "express";
import swaggerUi from "swagger-ui-express";
import pathToRegexp from "path-to-regexp";
import { initializeTemplates } from "./router";
import _ from "lodash";

function extractParamsFromPath(path) {
  const pathKeys = [];
  let pathRegex = pathToRegexp(path, pathKeys);
  return pathKeys;
}

function groupTemplateByPath(templates, resourcePath) {
  return templates.reduce((templateGroup, template) => {
    const swaggerPath = template.req.path.replace(
      /(?::([a-zA-Z]+))(:?\(.+\))?/,
      "{$1}"
    );
    const path = `/${resourcePath}${swaggerPath}`;

    if (!templateGroup[path]) {
      templateGroup[path] = {};
    }

    let httpMethodGroup = templateGroup[path][template.req.method];

    templateGroup[path][template.req.method] = _.merge(
      {},
      httpMethodGroup,
      template
    );
    return templateGroup;
  }, {});
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

  let paths = Object.keys(initializedTemplates).reduce(
    (paths, resourcePath) => {
      const groupedByPathTemplate = groupTemplateByPath(
        initializedTemplates[resourcePath],
        resourcePath
      );

      Object.keys(groupedByPathTemplate).forEach(path => {
        const swaggerPath = `${rootPath || ""}${path}`;
        const templateByPath = groupedByPathTemplate[path];

        Object.keys(groupedByPathTemplate[path]).forEach(method => {
          const template = templateByPath[method];

          const swaggerQueryParams = template.req.query
            ? Object.keys(template.req.query).map(key => {
                return {
                  in: "query",
                  name: key
                };
              })
            : [];

          const pathParams = extractParamsFromPath(template.req.path);
          const swaggerPathParams = pathParams.map(key => {
            return {
              in: "path",
              name: key.name
            };
          });

          const bodyParams =
            template.req.method === "post"
              ? [{ in: "body", name: "body" }]
              : [];

          const swaggerResponses = {};
          if (_.isNumber(template.res.status))
            swaggerResponses[template.res.status] = { description: "" };

          const pathObj = paths[swaggerPath] || {};
          pathObj[method] = {
            tags: [swaggerPath],
            description: "",
            parameters: [
              ...swaggerQueryParams,
              ...swaggerPathParams,
              ...bodyParams
            ],
            responses: swaggerResponses
          };
          paths[swaggerPath] = pathObj;
        });
      });

      return paths;
    },
    {}
  );

  swaggerSpec["paths"] = paths;

  const router = express.Router();
  router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return router;
}
