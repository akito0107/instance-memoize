export default (cache, keygen) => fn => (...args) => {
  const key = keygen(...args);
  const exists = cache.get(key);
  if (exists) {
    return exists;
  }
  const res = fn(...args);
  cache.set(key, res);
  return res;
};
