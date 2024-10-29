import { bench } from "vitest";
import { signal } from "./signal.js";
import { Signal } from "signal-polyfill";

bench("signal", () => {
  const state = signal(0);
  state.value = 1;
});

bench("polyfill - signal", () => {
  const state = new Signal.State(0);
  state.set(1);
});
