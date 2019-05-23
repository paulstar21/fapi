import * as tc from "./typechecking";

export default function isEqual(value, other) {
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

    for (let index = 0; index < value.length; index++) {
      const element = value[index];
      const otherElement = other[index];

      return isEqual(element, otherElement);
    }
  }

  if (tc.isObject(value) && tc.isObject(other)) {
    let valueKeys = Object.keys(value);
    let otherKeys = Object.keys(other);

    if (valueKeys.length !== otherKeys.length) return false;

    for (const vkey of valueKeys) {
      let v = value[vkey];
      let o = other[vkey];

      if (!isEqual(v, o)) {
        return false;
      }
    }

    return true;
  }

  return false;
}
