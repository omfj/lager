export const State = {
  CLEAN: 0,
  CHECK: 1,
  DIRTY: 2,
};

export type State = (typeof State)[keyof typeof State];
