import cacheable from "./cacheable";
import Cache from "./cache";

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
    if (!instance.hasOwnProperty("_purge")) {
      Object.defineProperty(instance, "_purge", {
        value: () => {
          instance["__$cache$__"].reset();
        }
      });
    }
  });
  return instance;
};

const defaultKeygen = (methodName, ...args) => {
  return methodName + args.join("");
};
