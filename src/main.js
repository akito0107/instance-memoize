import cacheable from './cacheable'

export default ({instance, methods = []}) => {
  methods.forEach((m) => {
    const fn = cacheable(instance[m].bind(instance))
    Object.defineProperty(instance, m, {
      value: (...args) => {
        return fn(...args)
      }
    })
  })
  return instance
}

