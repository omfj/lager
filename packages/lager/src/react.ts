import { Signal } from "signal-polyfill";
import { type Store } from "./store";
import { useSyncExternalStore, useCallback } from "react";

// dai-shi's `useSignal` implementation
// https://github.com/dai-shi/use-signals/blob/main/src/use-signal.ts
export const useStore = <T>(store: Store<T>) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      let needsEnqueue = true;

      const watcher = new Signal.subtle.Watcher(() => {
        if (needsEnqueue) {
          needsEnqueue = false;
          queueMicrotask(processPending);
        }
      });

      const processPending = () => {
        needsEnqueue = true;
        callback();
        watcher.watch();
      };

      watcher.watch(store);

      return () => watcher.unwatch(store);
    },
    [store]
  );
  const getSnapshot = () => store.get();

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
