"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
Object.defineProperty(exports, "router", {
  enumerable: true,
  get: function get() {
    return _router["default"];
  }
});

var _express = _interopRequireDefault(require("express"));

var _router = _interopRequireDefault(require("./router"));

var _defaults = _interopRequireDefault(require("./router/defaults"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(templates) {
  var app = (0, _express["default"])();
  app.use(_defaults["default"]);

  if (templates) {
    app.use("/api", (0, _router["default"])(templates));
  }

  return app;
}