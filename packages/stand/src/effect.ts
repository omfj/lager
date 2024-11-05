import { setCurrentNode } from "./current.js";

type CleanupFn = () => void;
type EffectFn = () => void | CleanupFn;

export class EffectNode {
  #effectFn: EffectFn;

  constructor(computeFn: EffectFn) {
    this.#effectFn = computeFn;

    this.run();
  }

  notify() {
    this.run();
  }

  private run() {
    setCurrentNode(this);
    const cleanUpFn = this.#effectFn();
    setCurrentNode(undefined);

    return cleanUpFn;
  }
}

export function effect(computeFn: EffectFn) {
  return new EffectNode(computeFn);
}
