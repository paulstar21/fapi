"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isEqual;

var tc = _interopRequireWildcard(require("./typechecking"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function isEqual(value, other) {
  if (tc.isUndefined(value) && !tc.isUndefined(other)) {
    return false;
  }

  if (!tc.isUndefined(value) && tc.isUndefined(other)) {
    return false;
  }

  if (tc.isPrimitive(value) && tc.isPrimitive(other)) {
    return value === other;
  }

  if (tc.isRegEx(value) && tc.isString(other)) {
    return value.test(other);
  }

  if (tc.isArray(value) && tc.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }

    for (var index = 0; index < value.length; index++) {
      var element = value[index];
      var otherElement = other[index];
      return isEqual(element, otherElement);
    }
  }

  if (tc.isObject(value) && tc.isObject(other)) {
    var valueKeys = Object.keys(value);
    var otherKeys = Object.keys(other);
    if (valueKeys.length !== otherKeys.length) return false;

    for (var _i = 0, _valueKeys = valueKeys; _i < _valueKeys.length; _i++) {
      var vkey = _valueKeys[_i];
      var v = value[vkey];
      var o = other[vkey];

      if (!isEqual(v, o)) {
        return false;
      }
    }

    return true;
  }

  return false;
}