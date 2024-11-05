import { isComputed, isEffect } from "./checks.js";
import { getCurrentNode, setCurrentNode } from "./current.js";
import type { EffectNode } from "./effect.js";

type EqualityFn<T> = (a: T, b: T) => boolean;

type ComputedOptions<T> = {
  equalityFn?: EqualityFn<T>;
  label?: string;
};

export class ComputedNode<T> {
  #computeFn: () => T;
  #value: T;
  /** Nodes that listens to this node */
  #consumers: Set<ComputedNode<unknown> | EffectNode> = new Set();
  #equalityFn: EqualityFn<T> = Object.is;
  #label?: string;

  constructor(computeFn: () => T, options: ComputedOptions<T> = {}) {
    if (options.equalityFn) {
      this.#equalityFn = options.equalityFn;
    }

    if (options.label) {
      this.#label = options.label;
    }

    this.#computeFn = computeFn;
    this.#value = this.compute();
  }

  get value() {
    const currentNode = getCurrentNode();
    if (isComputed(currentNode) || isEffect(currentNode)) {
      this.#consumers.add(currentNode);
    }

    return this.#value;
  }

  notify() {
    const prevValue = this.#value;
    this.#value = this.compute();

    // Do not notify if the value is the same
    const isSame = this.#equalityFn(prevValue, this.#value);
    if (isSame) return;

    for (const consumer of this.#consumers) {
      consumer.notify();
    }
  }

  compute() {
    setCurrentNode(this);
    const value = this.#computeFn();
    this.#value = value;
    setCurrentNode(undefined);

    if (this.#label) console.log("Computed", this.#label, value);

    return value;
  }
}

export function computed<T>(computeFn: () => T, options?: ComputedOptions<T>) {
  return new ComputedNode(computeFn, options);
}
