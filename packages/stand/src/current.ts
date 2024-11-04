import { ComputedNode } from "./computed.js";
import { EffectNode } from "./effect.js";
import { SignalNode } from "./signal.js";
import { getIsTracking } from "./tracking.js";

type CurrentNode = ComputedNode<any> | SignalNode<any> | EffectNode | undefined;

let currentNode: CurrentNode = undefined;

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

export function getCurrentNode(): CurrentNode {
  if (!getIsTracking()) {
    return undefined;
  }

  return currentNode;
}

export function setCurrentNode(node: CurrentNode) {
  currentNode = node;
}
