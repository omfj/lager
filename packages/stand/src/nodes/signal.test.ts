import { describe, it, expect } from "vitest";
import { signal } from "./signal.js";

describe("SignalNode", () => {
  it("should create a signal node", () => {
    const s = signal(1);
    expect(s.value).toBe(1);
  });

  it("should update the signal", () => {
    const s = signal(1);
    s.value = 2;
    expect(s.value).toBe(2);
  });

  it("should use custom equality function", () => {
    const s = signal([1, 2], {
      isEqual: (a, b) => a.length === b.length,
    });

    s.value = [2, 1];

    expect(s.value).toEqual([1, 2]);
  });
});
