// @flow

import type { ICache } from "./cache";
export type keygenFunc = (methodName: string, ...args: [any]) => string;

type memoFunc = (v: any) => any;

export default (cache: ICache, keygen: keygenFunc) => (fn: memoFunc) => (
  ...args: [any]
) => {
  const orgMethodName = fn.name.slice(6); // remove "bound "
  const key = keygen(orgMethodName, ...args);
  const exists = cache.get(key);
  if (exists) {
    return exists;
  }
  const res = fn(...args);

  cache.set(key, res);
  return res;
};
