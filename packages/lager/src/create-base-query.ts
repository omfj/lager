/**
 * Implementation of @tanstackk/angular-query-experimental using `signal-polyfill`
 *
 * This implementation is a direct port of the original implementation, with the only difference being the use of `signal-polyfill` instead of Angular's signals.
 *
 * Credit goes to the original authors of the library.
 *
 * https://github.com/TanStack/query/blob/main/packages/angular-query-experimental/src/create-base-query.ts
 */

import { Signal } from "signal-polyfill";
import {
  notifyManager,
  QueryClient,
  type QueryKey,
  QueryObserver,
  type QueryObserverResult,
} from "@tanstack/query-core";
import { watch } from "./watch";
import {
  type CreateBaseQueryOptions,
  type CreateBaseQueryResult,
} from "./types";
import { signalProxy } from "./signal-proxy";

export function createBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>(
  queryClient: QueryClient,
  options: CreateBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  Observer: typeof QueryObserver
): CreateBaseQueryResult<TData, TError> {
  /**
   * Signal that has the default options from query client applied
   * computed() is used so signals can be inserted into the options
   * making it reactive. Wrapping options in a function ensures embedded expressions
   * are preserved and can keep being applied after signal changes
   */
  const defaultedOptionsSignal = new Signal.Computed(() => {
    const defaultedOptions = queryClient.defaultQueryOptions(options);
    defaultedOptions._optimisticResults = "optimistic";
    return defaultedOptions;
  });

  const observer = new Observer<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >(queryClient, defaultedOptionsSignal.get());

  const resultSignal = new Signal.State(
    observer.getOptimisticResult(defaultedOptionsSignal.get())
  );

  const disposeWatch = watch(() => {
    const defaultedOptions = defaultedOptionsSignal.get();
    observer.setOptions(defaultedOptions, {
      // Do not notify on updates because of changes in the options because
      // these changes should already be reflected in the optimistic result.
      listeners: false,
    });

    resultSignal.set(observer.getOptimisticResult(defaultedOptions));
  });

  const unsubscribe = observer.subscribe(
    notifyManager.batchCalls((state: QueryObserverResult<TData, TError>) => {
      if (state.isError && !state.isFetching) {
        throw state.error;
      }
      resultSignal.set(state);
    })
  );

  const dispose = () => {
    unsubscribe();
    disposeWatch();
    observer.destroy();
  };

  return {
    ...(signalProxy(resultSignal) as unknown as CreateBaseQueryResult<
      TData,
      TError
    >),
    dispose,
  };
}
