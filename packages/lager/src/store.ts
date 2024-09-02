import { Signal } from "signal-polyfill";

export type Store<T> = Signal.State<T>;

export const createStore = <T>(initialState: T): Store<T> => {
  return new Signal.State(initialState);
};

export type ResourceState = "pending" | "success" | "error";

export type Resource<T> = {
  state: Store<ResourceState>;
  value: Store<T | null>;
};

export const createResource = <T>(
  fetcher: () => Promise<T> | T
): Resource<T> => {
  const value = createStore<T | null>(null);
  const state = createStore<ResourceState>("pending");

  const fetch = async () => {
    try {
      const result = await fetcher();
      value.set(result);
      state.set("success");
    } catch (e) {
      state.set("error");
    }
  };

  fetch();

  return { state, value };
};
