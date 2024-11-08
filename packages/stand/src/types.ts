import type { ComputedNode } from "./nodes/computed.js";
import type { EffectNode } from "./nodes/effect.js";
import type { SignalNode } from "./nodes/signal.js";

export type AnySignal = SignalNode<any>;
export type AnyComputed = ComputedNode<any>;
export type AnyNode = AnySignal | AnyComputed | EffectNode;
