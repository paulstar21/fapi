import _ from "lodash";
import { isEqualCustomizer } from "../utils";

function isEqual(value, other) {
  return _.isEqualWith(value, other, isEqualCustomizer);
}

export function allPropMatcher(value, other) {
  return () => {
    if (typeof value === "undefined") return true;
    return isEqual(value, other);
  };
}

export function leftPropMatcher(value, other) {
  return () => {
    if (typeof value === "undefined") return true;

    return Object.keys(value).every(key => {
      return isEqual(value[key], other[key]);
    });
  };
}
