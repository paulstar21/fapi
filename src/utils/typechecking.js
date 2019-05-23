export function isObject(arg) {
  return arg !== null && typeof arg === "object";
}
export function isFunction(arg) {
  return typeof arg === "function";
}
export function isArray(arg) {
  return arg && arg instanceof Array;
}
export function isPrimitive(arg) {
  var type = typeof arg;
  return arg == null || (type != "object" && type != "function");
}
export function isString(arg) {
  var type = typeof arg;
  return arg == null || type == "string";
}
export function isRegEx(arg) {
  return arg && arg instanceof RegExp;
}
export function isUndefined(arg) {
  return typeof arg === "undefined";
}
