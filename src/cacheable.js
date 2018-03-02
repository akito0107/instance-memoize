import Cache from "./cache";

export default (fn) => {
  const cache = new Cache()
  return (...args) => {
    const exists = cache.get(...args)
    if(exists) {
      return exists
    }
    const res = fn(...args)
    cache.set(res, ...args)
    return res
  }
}