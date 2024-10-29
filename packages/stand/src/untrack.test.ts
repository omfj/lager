import { describe, it, expect } from "vitest";
import { untrack } from "./untrack.js";
import { signal } from "./signal.js";
import { computed } from "./computed.js";

describe("Untrack", () => {
  it("should not run the effect", () => {
    const state = signal(0);
    const c = computed(() => state.value + 1);

    untrack(() => {
      state.value = 1;
    });

    expect(c.value).toBe(1);
  });
});