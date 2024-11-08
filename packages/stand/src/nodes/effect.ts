import { setActiveNode } from "../graph/active.js";
import type { AnyComputed, AnySignal } from "../types.js";

type CleanupFn = () => void;
type EffectFn = () => void | CleanupFn;

export class EffectNode {
  #effectFn: EffectFn;
  #cleanupFn?: CleanupFn;
  #dependencies: Set<AnySignal | AnyComputed> = new Set();

  constructor(computeFn: EffectFn) {
    this.#effectFn = computeFn;

    this.run();
  }

  notify() {
    this.run();
  }

  run() {
    this.#dependencies.forEach((dep) => dep.removeConsumer(this));
    this.#dependencies.clear();

    setActiveNode(this);

    try {
      const cleanup = this.#effectFn();
      if (typeof cleanup === "function") {
        this.#cleanupFn = cleanup;
      }
    } finally {
      setActiveNode(undefined);
    }
  }

  addDependency(node: AnySignal | AnyComputed) {
    this.#dependencies.add(node);
  }

  cleanup() {
    this.#dependencies.forEach((dep) => dep.removeConsumer(this));
    this.#cleanupFn?.();
    this.#dependencies.clear();
  }
}

export function effect(computeFn: EffectFn) {
  return new EffectNode(computeFn);
}
