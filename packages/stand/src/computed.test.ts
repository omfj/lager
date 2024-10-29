import { describe, it, expect } from "vitest";
import { computed } from "./computed.js";
import { signal } from "./signal.js";

describe("Computed", () => {
  it("should listen to changes", () => {
    const s = signal(1);
    const c = computed(() => s.value * 2);

    expect(c.value).toBe(2);

    s.value = 2;

    expect(c.value).toBe(4);
  });
});
