"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.isPrimitive = isPrimitive;
exports.isString = isString;
exports.isRegEx = isRegEx;
exports.isUndefined = isUndefined;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isObject(arg) {
  return arg !== null && _typeof(arg) === "object";
}

function isFunction(arg) {
  return typeof arg === "function";
}

function isArray(arg) {
  return arg && arg instanceof Array;
}

function isPrimitive(arg) {
  var type = _typeof(arg);

  return arg == null || type != "object" && type != "function";
}

function isString(arg) {
  var type = _typeof(arg);

  return arg == null || type == "string";
}

function isRegEx(arg) {
  return arg && arg instanceof RegExp;
}

function isUndefined(arg) {
  return typeof arg === "undefined";
}