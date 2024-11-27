import {
  type DefaultError,
  type MutationOptions,
  type QueryClient,
} from "@tanstack/query-core";
import { MutationObserver } from "@tanstack/query-core";
import { Signal } from "signal-polyfill";
import { CreateMutateFunction, CreateMutationResult } from "./types";
import { signalProxy } from "./signal-proxy";
import { watch } from "./watch";

export function createMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
>(
  queryClient: QueryClient,
  options: MutationOptions<TData, TError, TVariables, TContext>
) {
  const observer = new MutationObserver<TData, TError, TVariables, TContext>(
    queryClient,
    options
  );

  const dispose = watch(() => {
    observer.setOptions(options);
  });

  const mutate: CreateMutateFunction<TData, TError, TVariables, TContext> = (
    variables,
    mutateOptions
  ) => {
    observer.mutate(variables, mutateOptions).catch(() => {});
  };

  const result = new Signal.State({
    ...observer.getCurrentResult(),
    mutate,
    mutateAsync: observer.mutate,
    dispose,
  });

  return signalProxy(result) as unknown as CreateMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  >;
}
