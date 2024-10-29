import { setCurrentNode } from "./current.js";

export class EffectNode {
  #computeFn: () => void;

  constructor(computeFn: () => void) {
    this.#computeFn = computeFn;

    this.compute();
  }

  notify() {
    this.compute();
  }

  private compute() {
    setCurrentNode(this);
    const value = this.#computeFn();
    setCurrentNode(undefined);

    return value;
  }
}

export function effect(computeFn: () => void) {
  return new EffectNode(computeFn);
}
