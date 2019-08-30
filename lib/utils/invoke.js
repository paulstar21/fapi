"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function iterateObj(obj, ctx) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = invoke(obj[key], ctx);
    return result;
  }, {});
}

function invokeFn(obj, ctx) {
  if (obj.length === 0) return invoke(obj(), ctx);
  if (obj.length === 1 && ctx) return invoke(obj(ctx), ctx);
  return obj;
}

function invoke(obj, ctx) {
  if (obj instanceof Function) return invokeFn(obj, ctx);
  if (obj instanceof RegExp) return obj;
  if (obj instanceof Array) return obj;
  if (obj instanceof Object) return iterateObj(obj, ctx);
  return obj;
}

var _default = invoke;
exports["default"] = _default;