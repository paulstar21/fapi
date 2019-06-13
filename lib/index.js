"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "router", {
  enumerable: true,
  get: function get() {
    return _router["default"];
  }
});
exports.server = exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _router = _interopRequireWildcard(require("./router"));

var _defaults = _interopRequireDefault(require("./router/defaults"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaultOptions = {
  enableSwagger: true
};

var server = function server(templates, options) {
  var ops = _lodash["default"].merge({}, defaultOptions, options);

  var app = (0, _express["default"])();
  app.use((0, _defaults["default"])());

  if (templates) {
    app.use("/api", (0, _router["default"])(templates));

    if (ops.enableSwagger) {
      app.use("/api-docs", (0, _router.swagger)(templates, "/api"));
    }
  }

  return app;
};

exports.server = server;
var _default = server;
exports["default"] = _default;