import { describe, it, expect } from "vitest";
import { signal } from "./signal.js";

describe("SignalNode", () => {
  it("should create a signal node", () => {
    const node = signal(1);
    expect(node.value).toBe(1);
  });

  it("should update the signal", () => {
    const node = signal(1);
    node.value = 2;
    expect(node.value).toBe(2);
  });

  it("should use custom equality function", () => {
    const node = signal([1, 2], {
      equalityFn: (a, b) => a.length === b.length,
    });

    node.value = [2, 1];

    expect(node.value).toEqual([1, 2]);
  });
});
