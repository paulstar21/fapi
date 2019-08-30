import _ from "lodash";

export default function(value, other) {
  if (_.isRegExp(value) && _.isString(other)) {
    return value.test(other);
  }
}
