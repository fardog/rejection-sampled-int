var test = require('tape')

var lib = require('./')

test('returns integer', t => {
  for (var i = 0; i < 100; ++i) {
    var int = lib()

    t.ok(Number.isInteger(int))
    t.ok(Number.isSafeInteger(int))
  }

  t.end()
})

test('returns expected values given boundaries', t => {
  var boundaries = [7, 127, 255, 256, 65535, 65536, 4294967295, 4294967296]

  for (var boundary of boundaries) {
    for (var i = 0; i < 100; ++i) {
      t.ok(lib(0, boundary) < boundary)
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
