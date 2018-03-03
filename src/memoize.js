import cacheable from './cacheable'
import Cache from './Cache'

export default ({instance, methods = [], options = {}}) => {
  const cache = options.cache || new Cache()
  const keygenFn = options.keygen || defaultKeygen
  const wrap = cacheable(cache, keygenFn)
  methods.forEach((m) => {
    const fn = wrap(instance[m].bind(instance))
    Object.defineProperty(instance, m, {
      value: (...args) => {
        return fn(...args)
      }
    })
  })
  return instance
}

function defaultKeygen (...args) {
  return args.join("")
}