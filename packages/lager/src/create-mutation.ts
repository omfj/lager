import {
  type DefaultError,
  type MutationOptions,
  type QueryClient,
} from "@tanstack/query-core";
import { MutationObserver } from "@tanstack/query-core";
import { Signal } from "signal-polyfill";
import { CreateMutateFunction, CreateMutationResult } from "./types";
import { signalProxy } from "./signal-proxy";
import { effect } from "./effect";

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

  effect(() => {
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
  });

  return signalProxy(result) as unknown as CreateMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  >;
}
