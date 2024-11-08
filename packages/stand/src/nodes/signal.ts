import { ComputedNode } from "./computed.js";
import { getActiveNode } from "../graph/active.js";
import { isComputedNode, isEffectNode } from "../checks.js";
import type { EffectNode } from "./effect.js";
import { getIsTracking } from "../graph/tracking.js";
import type { AnyComputed } from "../types.js";

export type SignalNodeOptions<T> = {
  isEqual?: (a: T, b: T) => boolean;
  label?: string;
};

export class SignalNode<T = undefined> {
  #value: T;
  #consumers: Set<ComputedNode<unknown> | EffectNode> = new Set();
  #isEqual: (a: T, b: T) => boolean = Object.is;

  constructor(value: T, opts: SignalNodeOptions<T> = {}) {
    this.#value = value;

    if (opts.isEqual) {
      this.#isEqual = opts.isEqual;
    }
  }

  get value() {
    const currentNode = getActiveNode();
    if (isComputedNode(currentNode) || isEffectNode(currentNode)) {
      this.#consumers.add(currentNode);
    }

    return this.#value;
  }

  set value(value: T) {
    if (this.#isEqual(value, this.#value)) {
      return;
    }

    this.#value = value;
    this.notifyConsumers();
  }

  removeConsumer(consumer: AnyComputed | EffectNode) {
    this.#consumers.delete(consumer);
  }

  private notifyConsumers() {
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
