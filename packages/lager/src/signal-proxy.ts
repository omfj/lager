/**
 * Implementation of @tanstackk/angular-query-experimental using `signal-polyfill`
 *
 * This implementation is a direct port of the original implementation, with the only difference being the use of `signal-polyfill` instead of Angular's signals.
 *
 * Credit goes to the original authors of the library.
 *
 * https://github.com/TanStack/query/blob/main/packages/angular-query-experimental/src/signal-proxy.ts
 */

import { Signal } from "signal-polyfill";
import { type MapToSignals } from "./types";

/**
 * Exposes fields of an object passed via an Angular `Signal` as `Computed` signals.
 * Functions on the object are passed through as-is.
 * @param inputSignal - `Signal` that must return an object.
 * @returns A proxy object with the same fields as the input object, but with each field wrapped in a `Computed` signal.
 */
export function signalProxy<TInput extends Record<string | symbol, any>>(
  inputSignal: Signal.State<TInput>
) {
  const internalState = {} as MapToSignals<TInput>;

  return new Proxy<MapToSignals<TInput>>(internalState, {
    get(target, prop) {
      // first check if we have it in our internal state and return it
      const computedField = target[prop];
      if (computedField) return computedField;

      const targetField = inputSignal.get()[prop];
      if (typeof targetField === "function") return targetField;

      // finally, create a computed field, store it and return it
      // @ts-expect-error
      return (target[prop] = new Signal.Computed(
        () => inputSignal.get()[prop]
      ));
    },
    has(_, prop) {
      return prop in inputSignal.get();
    },
    ownKeys() {
      return Reflect.ownKeys(Signal.subtle.untrack(() => inputSignal));
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true,
      };
    },
  });
}
