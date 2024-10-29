import { ComputedNode } from "./computed.js";
import { SignalNode } from "./signal.js";

type CurrentNode = ComputedNode<unknown> | SignalNode<unknown> | undefined;

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

export function getCurretnNode(): CurrentNode {
  return currentNode;
}

export function setCurrentNode(node: CurrentNode) {
  currentNode = node;
}
