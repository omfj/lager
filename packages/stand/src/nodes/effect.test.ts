import { describe, it, expect } from "vitest";
import { signal } from "./signal.js";
import { effect } from "./effect.js";

describe("EffectNode", () => {
  it("should run the effect", () => {
    let count = 0;
    let s = signal(0);

    effect(() => {
      s.value;
      count++;
    });

    expect(count).toBe(1);

    s.value = 1;

    expect(count).toBe(2);
  });
});
