import { describe, it, expect, vi } from "vitest";
import { computed } from "./computed.js";
import { signal } from "./signal.js";

describe("ComputedNode", () => {
  it("should listen to changes", () => {
    const s = signal(1);
    const c = computed(() => s.value * 2);

    expect(c.value).toBe(2);

    s.value = 2;

    expect(c.value).toBe(4);
  });

  it("should not trigger when value is the same", () => {
    const s = signal(1);
    const c = computed(() => s.value * 2);

    expect(c.value).toBe(2);

    s.value = 1;

    expect(c.value).toBe(2);
  });

  it("should use custom equality function", () => {
    const s = signal([1, 2]);
    const c1 = computed(() => s.value, {
      isEqual: (a, b) => a.length === b.length,
    });
    const c2 = computed(() => c1.value);
    const spy = vi.spyOn(c1, "notify");

    expect(c2.value).toStrictEqual([1, 2]);

    s.value = [2, 1];

    expect(c2.value).toStrictEqual([1, 2]);
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not glitch", () => {
    const s = signal(0);
    const c1 = computed(() => (s.value % 2 ? "odd" : "even"));
    const c2 = computed(() => `${s.value} is ${c1.value}`);

    expect(c2.value).toBe("0 is even");

    s.value = 1;

    expect(c2.value).toBe("1 is odd");
  });
});
