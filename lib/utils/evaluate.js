"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = evaluate;

var typechecking = _interopRequireWildcard(require("./typechecking"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function evaluate(value, context) {
  if (typechecking.isPrimitive(value)) {
    return value;
  }

  if (typechecking.isFunction(value)) {
    if (value.length === 0) {
      var result = value(context);
      return evaluate(result, context);
    }

    if (context) {
      var _result = value(context);

      return evaluate(_result, context);
    }

    return value;
  }

  if (typechecking.isArray(value)) {
    return value;
  }

  if (typechecking.isRegEx(value)) {
    return value;
  }

  if (typechecking.isObject(value)) {
    var retValue = {};
    Object.keys(value).forEach(function (key) {
      retValue[key] = evaluate(value[key], context);
    });
    return retValue;
  }

  return value;
}