export default (cache, keygen) => fn => (...args) => {
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
