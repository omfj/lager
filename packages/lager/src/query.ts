import {
  QueryClient,
  type QueryKey,
  QueryObserver,
} from "@tanstack/query-core";
import { createBaseQuery } from "./create-base-query";
import { type CreateBaseQueryOptions } from "./types";

export function createQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey
>(
  queryClient: QueryClient,
  options: CreateBaseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  return createBaseQuery(queryClient, options, QueryObserver);
}
