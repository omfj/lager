import { bench } from "vitest";
import { signal } from "./signal.js";
import { computed } from "./computed.js";
import { Signal } from "signal-polyfill";

bench("computed", () => {
  const s = signal(1);
  const c = computed(() => s.value * 2);
  s.value = 2;
});

bench("compouted - polyfill", () => {
  const s = new Signal.State(1);
  const c = new Signal.Computed(() => s.get() * 2);
  s.set(2);
});
