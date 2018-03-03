import cacheable from "./cacheable";
import Cache from "./Cache";

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
    if (!instance.hasOwnProperty("_cacheList")) {
      Object.defineProperty(instance, "_cacheList", {
        value: {}
      });
    }
    instance._cacheList[m] = cache;
    if (!instance.hasOwnProperty("_purge")) {
      Object.defineProperty(instance, "_purge", {
        value: method => {
          instance._cacheList[method].reset();
        }
      });
    }
  });
  return instance;
};

function defaultKeygen(...args) {
  return args.join("");
}
