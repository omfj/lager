import type { AnyComputed, AnySignal } from "./types.js";
import type { ActiveNode } from "./graph/active.js";
import { ComputedNode } from "./nodes/computed.js";
import { EffectNode } from "./nodes/effect.js";
import { SignalNode } from "./nodes/signal.js";

export function isComputedNode(node: ActiveNode): node is AnyComputed {
  return node instanceof ComputedNode;
}

export function isSignalNode(node: ActiveNode): node is AnySignal {
  return node instanceof SignalNode;
}

export function isEffectNode(node: ActiveNode): node is EffectNode {
  return node instanceof EffectNode;
}

export function isNone(node: ActiveNode): node is undefined {
  return node === undefined;
}
