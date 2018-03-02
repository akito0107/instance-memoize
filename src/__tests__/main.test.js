'use strict'

import assert from 'assert'
import hello from '../main'

test('hello', () => {
  assert.strictEqual(hello(), 2)
})