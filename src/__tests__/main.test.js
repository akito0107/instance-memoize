'use strict'

import assert from 'assert'
import memoize from '../main'

test('called once with same arguments', () => {
  let cnt = 0
  const obj = {
    method: (arg) => {
      cnt++
      return arg
    }
  }
  const wrapped = memoize({instance: obj, methods: ['method']})
  
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
  const wrapped = memoize({instance: obj, methods: ['method']})
  
  wrapped.method('test1')
  wrapped.method('test2')
  
  assert.strictEqual(cnt, 2)
})
