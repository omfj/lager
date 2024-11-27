import { Signal } from "signal-polyfill";

let needsEnqueue = true;

export const w = new Signal.subtle.Watcher(() => {
  if (needsEnqueue) {
    needsEnqueue = false;
    queueMicrotask(processPending);
  }
});

const processPending = () => {
  needsEnqueue = true;

  for (const s of w.getPending()) {
    s.get();
  }

  w.watch();
};

export type WatchCallback = () => unknown | (() => unknown);

export const watch = (callback: WatchCallback) => {
  let cleanup: ReturnType<WatchCallback> | undefined;

  const computed = new Signal.Computed(() => {
    typeof cleanup === "function" && cleanup();
    cleanup = callback();
  });

  w.watch(computed);
  computed.get();

  return () => {
    w.unwatch(computed);
    typeof cleanup === "function" && cleanup();
    cleanup = undefined;
  };
};
