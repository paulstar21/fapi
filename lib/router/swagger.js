"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _express = _interopRequireDefault(require("express"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _pathToRegexp = _interopRequireDefault(require("path-to-regexp"));

var _router = require("./router");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function extractParamsFromPath(path) {
  var pathKeys = [];
  var pathRegex = (0, _pathToRegexp["default"])(path, pathKeys);
  return pathKeys;
}

function groupTemplateByPath(templates, resourcePath) {
  return templates.reduce(function (templateGroup, template) {
    var swaggerPath = template.req.path.replace(/(?::([a-zA-Z]+))(:?\(.+\))?/, "{$1}");
    var path = "/".concat(resourcePath).concat(swaggerPath);

    if (!templateGroup[path]) {
      templateGroup[path] = {};
    }

    var httpMethodGroup = templateGroup[path][template.req.method];
    templateGroup[path][template.req.method] = _lodash["default"].merge({}, httpMethodGroup, template);
    return templateGroup;
  }, {});
}

function _default(templates, rootPath) {
  var initializedTemplates = (0, _router.initializeTemplates)(templates);
  var swaggerSpec = {
    swagger: "2.0",
    info: {
      title: "fapi",
      description: "",
      version: "1.0"
    },
    produces: ["application/json"]
  };
  var paths = Object.keys(initializedTemplates).reduce(function (paths, resourcePath) {
    var groupedByPathTemplate = groupTemplateByPath(initializedTemplates[resourcePath], resourcePath);
    Object.keys(groupedByPathTemplate).forEach(function (path) {
      var swaggerPath = "".concat(rootPath || "").concat(path);
      var templateByPath = groupedByPathTemplate[path];
      Object.keys(groupedByPathTemplate[path]).forEach(function (method) {
        var template = templateByPath[method];
        var swaggerQueryParams = template.req.query ? Object.keys(template.req.query).map(function (key) {
          return {
            "in": "query",
            name: key
          };
        }) : [];
        var pathParams = extractParamsFromPath(template.req.path);
        var swaggerPathParams = pathParams.map(function (key) {
          return {
            "in": "path",
            name: key.name
          };
        });
        var bodyParams = template.req.method === "post" ? [{
          "in": "body",
          name: "body"
        }] : [];
        var swaggerResponses = {};
        if (_lodash["default"].isNumber(template.res.status)) swaggerResponses[template.res.status] = {
          description: ""
        };
        var pathObj = paths[swaggerPath] || {};
        pathObj[method] = {
          tags: [swaggerPath],
          description: "",
          parameters: [].concat(_toConsumableArray(swaggerQueryParams), _toConsumableArray(swaggerPathParams), bodyParams),
          responses: swaggerResponses
        };
        paths[swaggerPath] = pathObj;
      });
    });
    return paths;
  }, {});
  swaggerSpec["paths"] = paths;

  var router = _express["default"].Router();

  router.use("/", _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(swaggerSpec));
  return router;
}