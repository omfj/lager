import { ComputedNode } from "./computed.js";
import { getCurrentNode } from "./current.js";
import { isComputed, isEffect } from "./checks.js";
import type { EffectNode } from "./effect.js";
import { getIsTracking } from "./tracking.js";

export type SignalNodeOptions<T> = {
  equalityFn?: (a: T, b: T) => boolean;
  label?: string;
};

export class SignalNode<T = undefined> {
  #value: T;
  /** Nodes that listens to this node */
  #consumers: Set<ComputedNode<unknown> | EffectNode> = new Set();
  #equalityFn: (a: T, b: T) => boolean = Object.is;

  /** For debugging */
  #label?: string;

  constructor(value: T, opts: SignalNodeOptions<T> = {}) {
    this.#value = value;

    if (opts.equalityFn) {
      this.#equalityFn = opts.equalityFn;
    }

    if (opts.label) {
      this.#label = opts.label;
    }
  }

  get value() {
    const currentNode = getCurrentNode();
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
    const isTracking = getIsTracking();
    if (!isTracking) {
      return;
    }

    for (const consumer of this.#consumers) {
      consumer.notify();
    }
  }
}

export function signal<T = undefined>(value: T, opts?: SignalNodeOptions<T>) {
  return new SignalNode(value, opts);
}
