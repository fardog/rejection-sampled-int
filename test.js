var test = require('tape')

var lib = require('./')

test('returns integer', t => {
  var i = 0
  while (i < 100) {
    var int = lib()

    t.ok(Number.isInteger(int))
    t.ok(Number.isSafeInteger(int))
    ++i
  }

  t.end()
})

test('returns expected values given boundaries', t => {
  var boundaries = [7, 127, 255, 256, 65535, 65536, 4294967295, 4294967296]

  for (var i = 0; i < boundaries.length; ++i) {
    var j = 0
    while (j < 100) {
      t.ok(lib(0, boundaries[i]) < boundaries[i])
      ++j
    }
  }

  t.end()
})

test('throws on too large max', t => {
  t.throws(() => lib._setup(0, Number.MAX_SAFE_INTEGER + 1))
  t.throws(() => lib(0, Number.MAX_SAFE_INTEGER + 1))
  t.end()
})

test('throws on min > max', t => {
  t.throws(() => lib._setup(10, 2))
  t.throws(() => lib(10, 2))
  t.end()
})

test('setup calculations', t => {
  t.deepEqual(lib._setup(0, 7), {bytesNeeded: 1})
  t.deepEqual(lib._setup(0, 255), {bytesNeeded: 1})
  t.deepEqual(lib._setup(0, 256), {bytesNeeded: 2})
  t.deepEqual(lib._setup(0, 65535), {bytesNeeded: 2})
  t.deepEqual(lib._setup(0, 65536), {bytesNeeded: 3})
  t.deepEqual(lib._setup(0, 4294967295), {bytesNeeded: 4})
  t.deepEqual(lib._setup(0, 4294967296), {bytesNeeded: 5})
  t.end()
})
