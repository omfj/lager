import { setIsTracking } from "./graph/tracking.js";

export function untrack(fn: () => void) {
  setIsTracking(false);
  fn();
  setIsTracking(true);
}
