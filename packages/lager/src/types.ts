/**
 * Implementation of @tanstackk/angular-query-experimental using `signal-polyfill`
 *
 * This implementation is a direct port of the original implementation, with the only difference being the use of `signal-polyfill` instead of Angular's signals.
 *
 * Credit goes to the original authors of the library.
 *
 * https://github.com/TanStack/query/blob/main/packages/angular-query-experimental/src/types.ts
 */

import {
  type DefaultError,
  type QueryKey,
  type QueryObserverOptions,
  type QueryObserverResult,
  type OmitKeyof,
} from "@tanstack/query-core";
import { Signal } from "signal-polyfill";

export interface CreateBaseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  > {}

type CreateStatusBasedQueryResult<
  TStatus extends QueryObserverResult["status"],
  TData = unknown,
  TError = DefaultError
> = Extract<QueryObserverResult<TData, TError>, { status: TStatus }>;

export type MapToSignals<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : Signal.State<T[K]>;
};

export interface BaseQueryNarrowing<TData = unknown, TError = DefaultError> {
  isSuccess: (
    this: CreateBaseQueryResult<TData, TError>
  ) => this is CreateBaseQueryResult<
    TData,
    TError,
    CreateStatusBasedQueryResult<"success", TData, TError>
  >;
  isError: (
    this: CreateBaseQueryResult<TData, TError>
  ) => this is CreateBaseQueryResult<
    TData,
    TError,
    CreateStatusBasedQueryResult<"error", TData, TError>
  >;
  isPending: (
    this: CreateBaseQueryResult<TData, TError>
  ) => this is CreateBaseQueryResult<
    TData,
    TError,
    CreateStatusBasedQueryResult<"pending", TData, TError>
  >;
}

export type CreateBaseQueryResult<
  TData = unknown,
  TError = DefaultError,
  TState = QueryObserverResult<TData, TError>
> = BaseQueryNarrowing<TData, TError> &
  MapToSignals<OmitKeyof<TState, keyof BaseQueryNarrowing, "safely">>;
