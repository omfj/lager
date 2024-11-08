import { isComputedNode, isEffectNode } from "../checks.js";
import { getActiveNode, setActiveNode } from "../graph/active.js";
import { State } from "../state.js";
import type { AnyComputed, AnySignal } from "../types.js";
import type { EffectNode } from "./effect.js";

type EqualityFn<T> = (a: T, b: T) => boolean;

type ComputedOptions<T> = {
  isEqual?: EqualityFn<T>;
};

export class ComputedNode<T> {
  #computeFn: () => T;
  #value: T;
  #dependencies: Set<AnySignal | AnyComputed> = new Set();
  #consumers: Set<AnyComputed | EffectNode> = new Set();
  #isEqual: EqualityFn<T> = Object.is;
  #state: State = State.CLEAN;

  constructor(computeFn: () => T, options: ComputedOptions<T> = {}) {
    if (options.isEqual) {
      this.#isEqual = options.isEqual;
    }

    this.#computeFn = computeFn;
    this.#value = this.compute();
  }

  get value() {
    if (this.#state === State.DIRTY) {
      const newValue = this.compute();
      if (!this.#isEqual(this.#value, newValue)) {
        this.#value = newValue;
        this.notifyConsumers();
      }
      this.#state = State.CLEAN;
    }

    const currentNode = getActiveNode();

    // If the current node is a computed or effect node, add it as a consumer
    if (isComputedNode(currentNode) || isEffectNode(currentNode)) {
      this.#consumers.add(currentNode);
    }

    // If it is a computed node, add this node as a dependency
    if (isComputedNode(currentNode)) {
      currentNode.addDependency(this);
    }

    return this.#value;
  }

  notify() {
    if (this.#state === State.DIRTY) return;

    this.#state = State.DIRTY;

    this.notifyConsumers();
  }

  compute() {
    this.#dependencies.clear();

    setActiveNode(this);
    const value = this.#computeFn();
    setActiveNode(undefined);

    return value;
  }

  addDependency(node: AnySignal | AnyComputed) {
    this.#dependencies.add(node);
  }

  removeConsumer(consumer: AnyComputed | EffectNode) {
    this.#consumers.delete(consumer);
  }

  notifyConsumers() {
    for (const consumer of this.#consumers) {
      consumer.notify();
    }
  }
}

export function computed<T>(computeFn: () => T, options?: ComputedOptions<T>) {
  return new ComputedNode(computeFn, options);
}
