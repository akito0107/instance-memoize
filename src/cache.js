export default class Cache {
  constructor(opts = {}) {
    this.body = {}
    this.keygen = opts.keygen || defaultKeygen
  }
  get(...keys) {
    return this.body[this.keygen(...keys)]
  }
  set(res, ...keys) {
    const exists = this.get(...keys)
    this.body[this.keygen(...keys)] = res
    return exists
  }
}

function defaultKeygen (...args) {
  return args.join("")
}