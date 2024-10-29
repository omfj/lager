import { ComputedNode } from "./computed.js";
import { getCurretnNode, isComputed } from "./current.js";

export class SignalNode<T> {
  #value: T;
  /** Nodes that listens to this node */
  #consumers: Set<ComputedNode<unknown>> = new Set();

  constructor(value: T) {
    this.#value = value;
  }

  get value() {
    const currentNode = getCurretnNode();
    if (isComputed(currentNode)) {
      this.#consumers.add(currentNode);
    }

    return this.#value;
  }

  set value(value: T) {
    if (Object.is(value, this.#value)) {
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

export function signal<T>(value: T) {
  return new SignalNode(value);
}
