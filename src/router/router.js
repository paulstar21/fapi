import express from "express";
import _ from "lodash";
import { leftPropMatcher, allPropMatcher } from "./propMatchers";
import { invoke } from "../utils";
import swaggerUi from "swagger-ui-express";
import pathToRegexp from "path-to-regexp";

function initialize(templates) {
  const templateDefaults = {
    req: { method: "get", path: "/" },
    res: { body: null, status: 200 }
  };

  return Object.keys(templates).reduce((initializedTemplates, key) => {
    const templateCollection = templates[key];
    if (!(templateCollection instanceof Array))
      throw `${key} expected to be an array.`;

    initializedTemplates[key] = templates[key].map(template => {
      return _.merge({}, templateDefaults, invoke(template));
    });
    return initializedTemplates;
  }, {});
}

function allMatched(matcher) {
  return matcher();
}

function routeBuilder(router) {
  return template => {
    router[template.req.method](template.req.path, (req, res, next) => {
      const reqTemplate = invoke(template.req, { req });

      const matchers = [
        leftPropMatcher(reqTemplate.headers, req.headers),
        allPropMatcher(reqTemplate.query, req.query),
        allPropMatcher(reqTemplate.body, req.body)
      ];

      if (!matchers.every(allMatched)) {
        next();
        return;
      }

      const resTemplate = invoke(template.res, { req });
      res.status(resTemplate.status);
      res.send(resTemplate.body);
    });
  };
}

function buildRouter(templates) {
  const router = express.Router();

  for (const key in templates) {
    const subRouter = express.Router();
    const buildRoute = routeBuilder(subRouter);

    templates[key].forEach(buildRoute);

    router.use(`/${key}`, subRouter);
  }

  return router;
}

export function swagger(templates, rootPath) {
  const initializedTemplates = initialize(templates);

  const swaggerSpec = {
    swagger: "2.0",
    info: {
      title: "Blah",
      description: "",
      version: "1.0"
    },
    produces: ["application/json"],
    paths: {}
  };
  let paths = {};

  Object.keys(initializedTemplates).forEach(key => {
    templates = initializedTemplates[key];

    templates.forEach(template => {
      let path = `${rootPath || ""}/${key}${template.req.path}`;
      const pathObj = paths[path] || {};

      const pathKeys = [];
      const parameters = [];
      let pathRegex = pathToRegexp(template.req.path, pathKeys);
      if (pathKeys.length > 0) {
        pathKeys.forEach(key => {
          let r = new RegExp(`:${key.name}(\\(.+\\))?`);
          path = path.replace(r, `{${key.name}}`);
          parameters.push({
            in: "path",
            name: key.name
          });
        });
      }

      pathObj[template.req.method] = {
        tags: [path],
        description: "",
        parameters,
        responses: {}
      };
      paths[path] = pathObj;
    });
    swaggerSpec["paths"] = paths;
  });
  const router = express.Router();
  router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return router;
}

export default function(templates) {
  const initializedRoutes = initialize(templates);
  return buildRouter(initializedRoutes);
}
