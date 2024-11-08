import { getIsTracking } from "./tracking.js";
import type { AnyNode } from "../types.js";

export type ActiveNode = AnyNode | undefined;

let activeNode: ActiveNode = undefined;

export function getActiveNode(): ActiveNode {
  if (!getIsTracking()) {
    return undefined;
  }

  return activeNode;
}

export function setActiveNode(node: ActiveNode) {
  activeNode = node;
}
