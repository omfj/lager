import { setIsTracking } from "./current.js";

export function untrack(fn: () => void) {
  setIsTracking(false);
  fn();
  setIsTracking(true);
}
