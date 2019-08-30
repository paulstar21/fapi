"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(value, other) {
  if (_lodash["default"].isRegExp(value) && _lodash["default"].isString(other)) {
    return value.test(other);
  }
}