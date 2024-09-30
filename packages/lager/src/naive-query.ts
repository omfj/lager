import {
  DefaultError,
  QueryClient,
  QueryKey,
  QueryObserverOptions,
} from "@tanstack/query-core";
import { Signal } from "signal-polyfill";

export type QueryStatus = "pending" | "error" | "success";
export type FetchStatus = "idle" | "error" | "fetching";

export type QueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;

export class Query<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
> {
  readonly #options: QueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;
  readonly #queryClient: QueryClient;

  #error = new Signal.State<TError | null>(null);
  #data = new Signal.State<TData | null>(null);
  #status = new Signal.State<QueryStatus>("pending");
  #fetchStatus = new Signal.State<FetchStatus>("fetching");

  constructor(
    queryClient: QueryClient,
    options: QueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>
  ) {
    this.#options = options;
    this.#queryClient = queryClient;

    const observer = this.#status.set("pending");
    this.fetch()
      .then(() => {
        this.#status.set("success");
        this.#fetchStatus.set("idle");
      })
      .catch((e) => {
        this.#status.set("error");
        this.#fetchStatus.set("error");
        this.#error.set(e);
      });
  }

  get data() {
    return this.#data.get();
  }

  get error() {
    return this.#error.get();
  }

  get isError() {
    return this.#error.get() !== null;
  }

  get isLoading() {
    return this.isPending && this.isFetching;
  }

  get status() {
    return this.#status.get();
  }

  get fetchStatus() {
    return this.#fetchStatus.get();
  }

  get isSuccess() {
    return this.#status.get() === "success";
  }

  get isPending() {
    return this.#status.get() === "pending";
  }

  get isFetching() {
    return this.#fetchStatus.get() === "fetching";
  }

  get isIdle() {
    return this.#fetchStatus.get() === "idle";
  }

  async refetch() {
    this.#fetchStatus.set("fetching");
    await this.fetch();
    this.#fetchStatus.set("idle");
  }

  private async fetch() {
    try {
      const result = await this.#queryClient.fetchQuery(this.#options);
      this.#data.set(result);
    } catch (error) {
      this.#error.set(error);
    }
  }
}
