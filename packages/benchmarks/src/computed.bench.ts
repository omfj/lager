import { bench } from "vitest";
import { signal, computed } from "stand";
import { Signal } from "signal-polyfill";
import { reactive } from "@reactively/core";
import { ref } from "@vue/reactivity";

bench("computed", () => {
  const s = signal(1);
  const c = computed(() => s.value * 2);
  s.value = 2;
});

bench("computed - polyfill", () => {
  const s = new Signal.State(1);
  const c = new Signal.Computed(() => s.get() * 2);
  s.set(2);
});

bench("computed - reactively", () => {
  const s = reactive(1);
  const c = computed(() => s.value * 2);
  s.value = 2;
});

bench("computed - vue", () => {
  const s = ref(1);
  const c = computed(() => s.value * 2);
  s.value = 2;
});
