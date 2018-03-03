'use strict'

import assert from 'assert'
import memoize from '../memoize'

test('called once with same arguments', () => {
  let cnt = 0
  const obj = {
    method: (arg) => {
      cnt++
      return arg
    }
  }
  const wrapped = memoize({ instance: obj, methods: ['method'] })
  
  wrapped.method('test')
  wrapped.method('test')
  
  assert.strictEqual(cnt, 1)
})

test('called twice with different arguments', () => {
  let cnt = 0
  const obj = {
    method: (arg) => {
      cnt++
      return arg
    }
  }
  const wrapped = memoize({ instance: obj, methods: ['method'] })
  
  wrapped.method('test1')
  wrapped.method('test2')
  
  assert.strictEqual(cnt, 2)
})

test('using customized cache', () => {
  let cnt = 0
  const obj = {
    method: (arg) => {
      cnt++
      return arg
    }
  }
  let getCalled = false
  let setCalled = false
  const cache = {
    get: () => {
      getCalled = true
    },
    set: () => {
      setCalled = true
    }
  }
  const wrapped = memoize({
    instance: obj, methods: ['method'], options: {
      cache
    }
  })
  
  wrapped.method('test1')
  assert(getCalled)
  assert(setCalled)
})

test('using customized keygen function', () => {
  let cnt = 0
  const obj = {
    method: (...arg) => {
      cnt++
      return arg
    }
  }
  let getCalledKey = ''
  let setCalledKey = ''
  const cache = {
    get: (key) => {
      getCalledKey = key
    },
    set: (key) => {
      setCalledKey = key
    }
  }
  const keygen = (...args) => {
    return args.join("//")
  }
  const wrapped = memoize({
    instance: obj, methods: ['method'], options: {
      cache,
      keygen
    }
  })
  const args = ['test1', 'test2', 'test3']
  wrapped.method(...args)
  assert.strictEqual(getCalledKey, keygen(...args))
  assert.strictEqual(setCalledKey, keygen(...args))
})
