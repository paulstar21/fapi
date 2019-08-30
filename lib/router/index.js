"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "swagger", {
  enumerable: true,
  get: function get() {
    return _swagger["default"];
  }
});
exports["default"] = void 0;

var _router = _interopRequireDefault(require("./router"));

var _swagger = _interopRequireDefault(require("./swagger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _router["default"];
exports["default"] = _default;