import { ComputedNode } from "./computed.js";
import type { CurrentNode } from "./current.js";
import { EffectNode } from "./effect.js";
import { SignalNode } from "./signal.js";
import type { AnyComputed, AnySignal } from "./types.js";

export function isComputed(node: CurrentNode): node is AnyComputed {
  return node instanceof ComputedNode;
}

export function isSignal(node: CurrentNode): node is AnySignal {
  return node instanceof SignalNode;
}

export function isEffect(node: CurrentNode): node is EffectNode {
  return node instanceof EffectNode;
}

export function isNone(node: CurrentNode): node is undefined {
  return node === undefined;
}
