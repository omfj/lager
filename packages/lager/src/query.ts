import {
  QueryClient,
  type QueryKey,
  QueryObserver,
} from "@tanstack/query-core";
import { createBaseQuery } from "./create-base-query";
import { type CreateBaseQueryOptions } from "./types";

const queryObserver = QueryObserver;

export function createQuery<
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
  >
) {
  return createBaseQuery(queryClient, options, queryObserver);
}
