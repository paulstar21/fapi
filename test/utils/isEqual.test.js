import { isEqual, resolve, evaluate } from "../../src/utils";

test("primitives", () => {
  expect(isEqual("a", "a")).toBe(true);
  expect(isEqual(true, true)).toBe(true);
  expect(isEqual(1, 1)).toBe(true);

  expect(isEqual("a", "b")).toBe(false);
  expect(isEqual(true, false)).toBe(false);
  expect(isEqual(1, 2)).toBe(false);
});

test("regex for value only when other is string", () => {
  expect(isEqual(/.*/, "a")).toBe(true);
  expect(isEqual(/.*/, 1)).toBe(false);
  expect(isEqual(/.*/, true)).toBe(false);
});

test("arrays", () => {
  expect(isEqual([1], [1])).toBe(true);
  expect(isEqual(["b"], ["b"])).toBe(true);
  expect(isEqual([true], [true])).toBe(true);

  expect(isEqual(["A", 1, true], ["A", 1, true])).toBe(true);
});

test("objects", () => {
  expect(isEqual({ a: "a" }, { a: "a", b: "b" })).toBe(false);
  expect(isEqual({ a: "a" }, { a: "a" })).toBe(true);

  let obj1 = {
    k1: "k1",
    k2: {
      sk1: "sk1",
      sk2: true,
      sk3: 1
    },
    k3: false,
    k4: 4
  };

  expect(isEqual(obj1, obj1)).toBe(true);
  expect(isEqual(obj1, {})).toBe(false);
  expect(isEqual({ a: /.*/ }, { a: "any value" })).toBe(true);
});

test("complex objects", () => {
  let value = {
    a: "a",
    b: ["a", 1],
    c: true,
    d: "d",
    e: /.*/,
    f: {
      fa: [1, 2],
      fb: { x: "x" },
      fc: /.*/
    }
  };

  let expected = {
    a: "a",
    b: ["a", 1],
    c: true,
    d: "d",
    e: "any-value",
    f: {
      fa: [1, 2],
      fb: { x: "x" },
      fc: "any-value"
    }
  };

  expect(isEqual(value, expected)).toBe(true);
});
