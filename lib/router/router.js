"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeTemplates = initializeTemplates;
exports["default"] = _default;

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _propMatchers = require("./propMatchers");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function initializeTemplates(templates) {
  var templateDefaults = {
    req: {
      method: "get",
      path: "/"
    },
    res: {
      body: null,
      status: 200
    }
  };
  return Object.keys(templates).reduce(function (initializedTemplates, key) {
    var templateCollection = templates[key];
    if (!(templateCollection instanceof Array)) throw "".concat(key, " expected to be an array.");
    initializedTemplates[key] = templates[key].map(function (template) {
      return _lodash["default"].merge({}, templateDefaults, (0, _utils.invoke)(template));
    });
    return initializedTemplates;
  }, {});
}

function allMatched(matcher) {
  return matcher();
}

function routeBuilder(router) {
  return function (template) {
    router[template.req.method](template.req.path, function (req, res, next) {
      var reqTemplate = (0, _utils.invoke)(template.req, {
        req: req
      });
      var matchers = [(0, _propMatchers.headerPropMatcher)(reqTemplate.headers, req.headers), (0, _propMatchers.allPropMatcher)(reqTemplate.query, req.query), (0, _propMatchers.allPropMatcher)(reqTemplate.body, req.body)];

      if (!matchers.every(allMatched)) {
        next();
        return;
      }

      var resTemplate = (0, _utils.invoke)(template.res, {
        req: req
      });
      res.status(resTemplate.status);
      res.send(resTemplate.body);
    });
  };
}

function buildRouter(templates) {
  var router = _express["default"].Router();

  for (var key in templates) {
    var subRouter = _express["default"].Router();

    var buildRoute = routeBuilder(subRouter);
    templates[key].forEach(buildRoute);
    router.use("/".concat(key), subRouter);
  }

  return router;
}

function _default(templates) {
  var initializedTemplates = initializeTemplates(templates);
  return buildRouter(initializedTemplates);
}