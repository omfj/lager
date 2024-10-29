import { ComputedNode } from "./computed.js";
import { getCurretnNode, isComputed, isEffect } from "./current.js";
import type { EffectNode } from "./effect.js";

export type SignalNodeOptions<T> = {
  equalityFn?: (a: T, b: T) => boolean;
};

export class SignalNode<T> {
  #value: T;
  /** Nodes that listens to this node */
  #consumers: Set<ComputedNode<unknown> | EffectNode> = new Set();
  #equalityFn: (a: T, b: T) => boolean = Object.is;

  constructor(value: T, opts: SignalNodeOptions<T>) {
    this.#value = value;

    if (opts.equalityFn) {
      this.#equalityFn = opts.equalityFn;
    }
  }

  get value() {
    const currentNode = getCurretnNode();
    if (isComputed(currentNode) || isEffect(currentNode)) {
      this.#consumers.add(currentNode);
    }

    return this.#value;
  }

  set value(value: T) {
    if (this.#equalityFn(value, this.#value)) {
      return;
    }

    this.#value = value;
    this.notify();
  }

  notify() {
    for (const consumer of this.#consumers) {
      consumer.notify();
    }
  }
}

export function signal<T>(value: T, opts: SignalNodeOptions<T> = {}) {
  return new SignalNode(value, opts);
}
