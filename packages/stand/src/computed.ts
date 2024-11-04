import {
  getCurretnNode,
  isComputed,
  isEffect,
  setCurrentNode,
} from "./current.js";
import type { EffectNode } from "./effect.js";

type EqualityFn<T> = (a: T, b: T) => boolean;

export class ComputedNode<T> {
  #computeFn: () => T;
  #value: T;
  /** Nodes that listens to this node */
  #consumers: Set<ComputedNode<unknown> | EffectNode> = new Set();
  #equalityFn: EqualityFn<T> = Object.is;

  constructor(computeFn: () => T, equalityFn?: EqualityFn<T>) {
    this.#computeFn = computeFn;
    this.#value = this.compute();

    if (equalityFn) {
      this.#equalityFn = equalityFn;
    }
  }

  get value() {
    const currentNode = getCurretnNode();
    if (isComputed(currentNode) || isEffect(currentNode)) {
      this.#consumers.add(currentNode);
    }

    return this.#value;
  }

  notify() {
    const prevValue = this.#value;
    this.#value = this.compute();

    const isSame = this.#equalityFn(prevValue, this.#value);

    if (isSame) {
      return;
    }

    for (const consumer of this.#consumers) {
      consumer.notify();
    }
  }

  private compute() {
    setCurrentNode(this);
    const value = this.#computeFn();
    setCurrentNode(undefined);
    return value;
  }
}

export function computed<T>(computeFn: () => T, equalityFn?: EqualityFn<T>) {
  return new ComputedNode(computeFn, equalityFn);
}
