import type { ComputedNode } from "./computed.js";
import type { EffectNode } from "./effect.js";
import type { SignalNode } from "./signal.js";

export type AnySignal = SignalNode<any>;
export type AnyComputed = ComputedNode<any>;
export type AnyNode = AnySignal | AnyComputed | EffectNode;
