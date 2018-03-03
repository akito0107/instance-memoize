export default class Cache {
  constructor(opts = {}) {
    this.body = {};
  }
  get(key) {
    return this.body[key];
  }
  set(key, obj) {
    const exists = this.get(key);
    this.body[key] = obj;
    return exists;
  }
  reset() {
    this.body = {};
  }
}
