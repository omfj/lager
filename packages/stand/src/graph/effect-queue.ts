import type { EffectNode } from "../nodes/effect.js";

let effectQueue: Array<EffectNode> = [];

export function addEffectToQueue(effect: EffectNode) {
  effectQueue.push(effect);
}

export function runEffectQueue() {
  for (const effect of effectQueue) {
    effect.run();
  }

  clearEffectQueue();
}

export function clearEffectQueue() {
  effectQueue = [];
}
