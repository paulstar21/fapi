import { leftPropMatcher, allPropMatcher } from "../../src/router/propMatchers";

test("leftPropMatcher returns true when left value is undefined", () => {
  let obj1;
  let obj2 = {};
  expect(leftPropMatcher(obj1, obj2)()).toBe(true);
});

test("leftPropMatcher returns true when all values on the left matches", () => {
  let obj1 = { a: "a" };
  let obj2 = { a: "a", b: "b" };
  expect(leftPropMatcher(obj1, obj2)()).toBe(true);
});

test("leftPropMatcher returns false when all values on the left does not match", () => {
  let obj1 = { a: "a" };
  let obj2 = { a: "b", b: "b" };
  expect(leftPropMatcher(obj1, obj2)()).toBe(false);
});

test("allPropMatcher returns true when left value is undefined", () => {
  let obj1;
  let obj2 = {};
  expect(allPropMatcher(obj1, obj2)()).toBe(true);
});

test("allPropMatcher returns true when all values match", () => {
  let obj1 = { a: "a" };
  let obj2 = { a: "a" };
  expect(allPropMatcher(obj1, obj2)()).toBe(true);
});

test("allPropMatcher returns false when all values does not match", () => {
  let obj1 = { a: "a" };
  let obj2 = { a: "a", b: "b" };
  expect(allPropMatcher(obj1, obj2)()).toBe(false);
});
