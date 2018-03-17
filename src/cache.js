// @flow

export interface ICache {
  get(key: string): any;
  set(key: string, val: any): ?any;
  reset(): ?any;
}

export default class Cache {
  body: Object;

  constructor(opts: any = {}) {
    this.body = {};
  }
  get(key: string) {
    return this.body[key];
  }
  set(key: string, obj: any) {
    const exists = this.get(key);
    this.body[key] = obj;
    return exists;
  }
  reset() {
    this.body = {};
  }
}
