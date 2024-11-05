import { EffectNode } from "./effect.js";
import { getIsTracking } from "./tracking.js";
import type { AnyComputed, AnySignal } from "./types.js";

export type CurrentNode = AnySignal | AnyComputed | EffectNode | undefined;

let currentNode: CurrentNode = undefined;

export function getCurrentNode(): CurrentNode {
  if (!getIsTracking()) {
    return undefined;
  }

  return currentNode;
}

export function setCurrentNode(node: CurrentNode) {
  currentNode = node;
}
