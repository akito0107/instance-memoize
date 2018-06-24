// @flow

import cacheable from "./cacheable";
import Cache from "./cache";
import hash from "object-hash";
import type { keygenFunc } from "./cacheable";

type Opts = {
  instance: any,
  methods: string[],
  options?: any
};

export default ({ instance, methods = [], options = {} }: Opts) => {
  const cache = options.cache || new Cache();
  const keygenFn = options.keygen || defaultKeygen;
  const wrap = cacheable(cache, keygenFn);

  methods.forEach(m => {
    const fn = wrap(instance[m].bind(instance));
    Object.defineProperty(instance, m, {
      value: (...args) => {
        return fn(...args);
      }
    });
    if (!instance.hasOwnProperty("_cache")) {
      instance["_cache"] = cache;
    }
    if (!instance.hasOwnProperty("_purge")) {
      instance["_purge"] = () => {
        instance["_cache"].reset();
      };
    }
  });
  return instance;
};

export const defaultKeygen: keygenFunc = (
  methodName: string,
  ...args: [any]
) => {
  return hash([methodName, ...args]);
};
