import {
  getCurretnNode,
  isComputed,
  isEffect,
  setCurrentNode,
} from "./current.js";
import type { EffectNode } from "./effect.js";

export class ComputedNode<T> {
  #computeFn: () => T;
  #value: T;
  /** Nodes that listens to this node */
  #consumers: Set<ComputedNode<unknown> | EffectNode> = new Set();

  constructor(computeFn: () => T) {
    this.#computeFn = computeFn;
    this.#value = this.compute();
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
    if (prevValue !== this.#value) {
      for (const consumer of this.#consumers) {
        consumer.notify();
      }
    }
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
