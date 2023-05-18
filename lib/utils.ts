export const randomArray = <T>(array: T[]) => (
  ([] as T[]).concat(array).sort(
    _ => Math.random() > .5 ? 1 : -1
  )
);

export const oneOf = <T>(...array: T[]) => (
  randomArray(array)[0]
);

export type FV<T, A extends any[] = []> = T | ((...args: A) => T);

export const fv = <T, A extends any[] = []>(v: FV<T, A>, ...args: A): T => {
  return v instanceof Function ? v(...args) : v;
};
