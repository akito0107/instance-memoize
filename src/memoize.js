import cacheable from "./cacheable";
import Cache from "./cache";
import hash from "object-hash";

export default ({ instance, methods = [], options = {} }) => {
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

export const defaultKeygen = (methodName, ...args) => {
  return hash([methodName, ...args]);
};
