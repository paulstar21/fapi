import express from "express";
import _ from "lodash";
import { leftPropMatcher, allPropMatcher } from "./propMatchers";
import { invoke } from "../utils";

function initialize(templates) {
  return Object.keys(templates).reduce((t, key) => {
    const templateCollection = templates[key];
    if (!(templateCollection instanceof Array))
      throw `${key} expected to be an array.`;

    t[key] = templates[key].map(template => {
      return _.merge(
        {},
        { req: { method: "get", path: "/" }, res: { body: null, status: 200 } },
        invoke(template)
      );
    });
    return t;
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

export default function(templates) {
  return buildRouter(initialize(templates));
}
