import * as typechecking from "./typechecking";

export default function evaluate(value, context) {
  if (typechecking.isPrimitive(value)) {
    return value;
  }

  if (typechecking.isFunction(value)) {
    if (value.length === 0) {
      let result = value(context);
      return evaluate(result, context);
    }

    if (context) {
      let result = value(context);
      return evaluate(result, context);
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
    let retValue = {};

    Object.keys(value).forEach(key => {
      retValue[key] = evaluate(value[key], context);
    });

    return retValue;
  }

  return value;
}
