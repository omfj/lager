import { setCurrentNode } from "./current.js";

export class ComputedNode<T> {
  #computeFn: () => T;
  #value: T;

  constructor(computeFn: () => T) {
    this.#computeFn = computeFn;
    this.#value = this.compute();
  }

  get value() {
    return this.#value;
  }

  notify() {
    this.#value = this.compute();
  }

  private compute() {
    setCurrentNode(this);
    const value = this.#computeFn();
    setCurrentNode(undefined);

    return value;
  }
}

export function computed<T>(computeFn: () => T) {
  return new ComputedNode(computeFn);
}
