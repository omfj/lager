import { effect } from "./effect.js";
import { describe, it, expect } from "vitest";
import { signal } from "./signal.js";

describe("Effect", () => {
  it("should run the effect", () => {
    let count = 0;

    const e = effect(() => {
      count++;
    });

    expect(count).toBe(1);

    e.notify();

    expect(count).toBe(2);
  });

  it("should react to state changes", () => {
    let count = 0;
    const state = signal(0);

    effect(() => {
      state.value;
      count++;
    });

    expect(count).toBe(1);

    state.value = 1;

    expect(count).toBe(2);
  });
});
