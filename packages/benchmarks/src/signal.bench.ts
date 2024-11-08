import { bench } from "vitest";
import { signal } from "stand";
import { Signal } from "signal-polyfill";
import { reactive } from "@reactively/core";
import { ref } from "@vue/reactivity";

bench("signal", () => {
  const state = signal(0);
  state.value = 1;
});

bench("signal - polyfill", () => {
  const state = new Signal.State(0);
  state.set(1);
});

bench("signal - reactively", () => {
  const state = reactive(0);
  state.value = 1;
});

bench("signal - vue", () => {
  const state = ref(0);
  state.value = 1;
});
