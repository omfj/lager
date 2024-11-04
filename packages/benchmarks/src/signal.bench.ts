import { bench } from "vitest";
import { signal } from "stand";
import { Signal } from "signal-polyfill";

bench("signal", () => {
  const state = signal(0);
  state.value = 1;
});

bench("signal - polyfill", () => {
  const state = new Signal.State(0);
  state.set(1);
});
