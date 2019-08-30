"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allPropMatcher = allPropMatcher;
exports.leftPropMatcher = leftPropMatcher;
exports.headerPropMatcher = headerPropMatcher;

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isEqual(value, other) {
  return _lodash["default"].isEqualWith(value, other, _utils.isEqualCustomizer);
}

function allPropMatcher(value, other) {
  return function () {
    if (typeof value === "undefined") return true;
    return isEqual(value, other);
  };
}

function leftPropMatcher(value, other) {
  return function () {
    if (typeof value === "undefined") return true;
    return Object.keys(value).every(function (key) {
      return isEqual(value[key], other[key]);
    });
  };
} //for header values we are looping through the header keys so only need a simple string comparison
//http headers are case insentive so make sure key comparison is lowercase
//http header values still checked for case sensitivity


function headerPropMatcher(value, other) {
  return function () {
    if (typeof value === "undefined") return true;
    return Object.keys(value).every(function (key) {
      return value[key] === other[key.toLowerCase()];
    });
  };
}