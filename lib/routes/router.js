"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

var tc = _interopRequireWildcard(require("../utils/typechecking"));

var _delay = _interopRequireDefault(require("./delay"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @param {Object} template
 * @param {express.Request} req
 */
function getStatus(resTemplate, req) {
  if (resTemplate.status) {
    return resTemplate.status;
  }

  var status = resTemplate.status || 200;

  if (req.method === "POST") {
    status = 201;
  }

  if (req.method === "GET" && !resTemplate.body) {
    status = 404;
  }

  return status;
}

function evaluateTemplate(template) {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  var fn = function fn(req, res, next) {
    if (req.matched === false) {
      next();
      return;
    }

    req.template = {
      req: (0, _utils.evaluate)(template.req, {
        template: template,
        req: req
      }),
      res: (0, _utils.evaluate)(template.res, {
        template: template,
        req: req
      })
    };
    next();
  };

  return fn;
}

function queryMatcher() {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return function (req, res, next) {
    if (req.matched === false) {
      next();
      return;
    }

    var template = req.template; // match query if specified

    var queryTemplate = template.req.query;

    if (queryTemplate) {
      req.matched = (0, _utils.isEqual)(queryTemplate, req.query);
    }

    next();
  };
}

function bodyMatcher() {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return function (req, res, next) {
    if (req.matched === false) {
      next();
      return;
    } // match body if specified


    var template = req.template;

    if (template.req.body) {
      req.matched = (0, _utils.isEqual)(template.req.body, req.body);
    }

    next();
  };
}

function headerMatcher() {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  return function (req, res, next) {
    if (req.matched === false) {
      next();
      return;
    }

    var headersTemplate = req.template.req.headers;

    if (headersTemplate) {
      req.matched = Object.keys(headersTemplate).every(function (header) {
        return (0, _utils.isEqual)(headersTemplate[header], req.get(header));
      });
    }

    next();
  };
}

function prepareResponse() {
  /**
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  var fn = function fn(req, res, next) {
    if (req.matched === false) {
      next();
      return;
    }

    res.set(req.template.res.headers);

    if (tc.isPrimitive(req.template.res) || tc.isArray(req.template.res)) {
      res.send(req.template.res);
      return;
    }

    res.status(getStatus(req.template.res, req));
    res.send(req.template.res.body);
  };

  return fn;
}

function defaultReqHandler(requestDefaults) {
  return function (req, res, next) {
    if (!requestDefaults) {
      next();
      return;
    }

    var evalReq = (0, _utils.evaluate)(requestDefaults, {
      req: req
    });

    if (evalReq.headers) {
      if (!(0, _utils.isEqual)(evalReq.headers["authorization"], req.get("authorization"))) {
        res.status(401);
        res.send(evalReq.body401);
        return;
      }

      req.matched = Object.keys(evalReq.headers).every(function (header) {
        return (0, _utils.isEqual)(evalReq.headers[header], req.get(header));
      });
    }

    next();
  };
}

function defaultResHandler(responseDefaults) {
  return function (req, res, next) {
    if (!responseDefaults) {
      res.status(404);
      res.send();
      return;
    }

    var evalRes = (0, _utils.evaluate)(responseDefaults, {
      req: req
    });

    if (evalRes.status) {
      res.status(evalRes.status);
      var body = evalRes["body".concat(evalRes.status)] || evalRes.body;
      console.log(body);
      res.send(body);
    }
  };
}

function _default(templates) {
  var defaultTemplate = {
    req: {
      method: "get",
      path: "/"
    },
    res: {}
  };

  var router = _express["default"].Router();

  for (var _i = 0, _Object$keys = Object.keys(templates); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var userTemplates = templates[key];
    var userDefaults = void 0;

    if (!_lodash["default"].isArray(userTemplates)) {
      userDefaults = userTemplates.defaults;
      userTemplates = userTemplates.templates;
    }

    userDefaults = _lodash["default"].merge({}, userDefaults);

    var subRouter = _express["default"].Router();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = userTemplates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var userTemplate = _step.value;

        var template = _lodash["default"].merge({}, defaultTemplate, userTemplate);

        var requestTemplate = (0, _utils.evaluate)(template.req);
        var handlers = [];
        var options = template.options;

        if (options) {
          if (options.delay) {
            handlers.push((0, _delay["default"])(options.delay));
          }
        }

        handlers.push(evaluateTemplate({
          req: requestTemplate,
          res: template.res
        }), headerMatcher(), queryMatcher(), bodyMatcher(), prepareResponse());
        subRouter[requestTemplate.method](requestTemplate.path, handlers);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    router.all("/".concat(key), defaultReqHandler(userDefaults.req));
    router.use("/".concat(key), subRouter);
    router.all("/".concat(key), defaultResHandler(userDefaults.res));
  }

  return router;
}