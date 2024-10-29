import { ComputedNode } from "./computed.js";
import { EffectNode } from "./effect.js";
import { SignalNode } from "./signal.js";

type CurrentNode =
  | ComputedNode<unknown>
  | SignalNode<unknown>
  | EffectNode
  | undefined;

let currentNode: CurrentNode = undefined;
let isTracking = true;

export function isNone(node: CurrentNode): node is undefined {
  return node === undefined;
}

export function isComputed(node: CurrentNode): node is ComputedNode<unknown> {
  return node instanceof ComputedNode;
}

export function isSignal(node: CurrentNode): node is SignalNode<unknown> {
  return node instanceof SignalNode;
}

export function isEffect(node: CurrentNode): node is EffectNode {
  return node instanceof EffectNode;
}

export function getCurretnNode(): CurrentNode {
  if (!isTracking) {
    return undefined;
  }

  return currentNode;
}

export function setIsTracking(value: boolean) {
  isTracking = value;
}

export function getIsTracking() {
  return isTracking;
}

export function setCurrentNode(node: CurrentNode) {
  currentNode = node;
}
