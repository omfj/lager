import { Signal } from "signal-polyfill";

const watcher = new Signal.subtle.Watcher(() => {
  queueMicrotask(processPending);
});

function processPending() {
  const pending = watcher.getPending();

  for (const signal of pending) {
    signal.get();
  }

  watcher.watch();
}

/**
 * Memoize/dedupe the result of a function.
 *
 * @param fn - Function to memoize.
 * @returns Memoized value.
 */
export function createMemo<T>(fn: () => T): { value: T } {
  const computed = new Signal.Computed(fn);
  watcher.watch(computed);

  return {
    get value() {
      return computed.get();
    },
  };
}
