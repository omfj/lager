import { Signal } from "signal-polyfill";
import {
  type FetchQueryOptions,
  type InvalidateOptions,
  type InvalidateQueryFilters,
  type MutationOptions,
  MutationObserver,
  QueryClient,
  type QueryKey,
  notifyManager,
} from "@tanstack/query-core";
import { type CreateMutateFunction } from "./types";

export class LagerClient {
  #queryClient: QueryClient;

  constructor(queryClient?: QueryClient) {
    this.#queryClient = queryClient ?? new QueryClient();
  }

  query<
    TQueryFnData,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never
  >(
    options: FetchQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >
  ) {
    const state = new Signal.State<TData | null>(null);
    const isLoading = new Signal.State<boolean>(true);
    const error = new Signal.State<TError | null>(null);

    const fetch = async () => {
      isLoading.set(true);
      try {
        const result = await this.#queryClient.fetchQuery(options);
        state.set(result);
      } catch (e) {
        error.set(e as TError);
      }
      isLoading.set(false);
    };

    fetch();

    return {
      get data() {
        return state.get();
      },
      get isLoading() {
        return isLoading.get();
      },
      get error() {
        return error.get();
      },
      refetch: fetch,
    };
  }

  async invalidateQueries(
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions
  ) {
    await this.#queryClient.invalidateQueries(filters, options);
  }

  mutate<TData, TError = Error, TVariables = void, TContext = unknown>(
    options: MutationOptions<TData, TError, TVariables, TContext>
  ) {
    const observer = new MutationObserver<TData, TError, TVariables, TContext>(
      this.#queryClient,
      options
    );

    const mutate: CreateMutateFunction<TData, TError, TVariables, TContext> = (
      variables,
      mutateOptions
    ) => {
      observer.mutate(variables, mutateOptions);
    };
    observer.setOptions(options);

    const result = new Signal.State(observer.getCurrentResult());

    observer.subscribe(() => {
      notifyManager.batch((val) => result.set(val));
    });

    return {
      ...result.get(),
      mutate,
      mutateAsync: result.get().mutate,
    };
  }
}
