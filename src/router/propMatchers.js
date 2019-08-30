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


//for header values we are looping through the header keys so only need a simple string comparison
//http headers are case insentive so make sure key comparison is lowercase
//http header values still checked for case sensitivity
export function headerPropMatcher(value, other) {
  return () => {
    if (typeof value === "undefined") return true;

    return Object.keys(value).every(key => {
      return value[key.toLowerCase()] === other[key.toLowerCase()];
    });
  };
}
