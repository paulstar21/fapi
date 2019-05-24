"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(ms, err) {
  ms = ms || 1000;
  return function (req, res, next) {
    setTimeout(next, ms, err);
  };
}