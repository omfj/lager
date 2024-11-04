import { setIsTracking } from "./tracking.js";

export function untrack(fn: () => void) {
  setIsTracking(false);
  fn();
  setIsTracking(true);
}
