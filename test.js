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

test('returns expected values given min boundaries', t => {
  var boundaries = [
    {min: 2, max: 7},
    {min: 10, max: 127},
    {min: 200, max: 255},
    {min: 100, max: 256},
    {min: 1000, max: 66536}
  ]

  for (var i = 0; i < boundaries.length; ++i) {
    var j = 0
    while (j < 100) {
      var int = lib(boundaries[i].min, boundaries[i].max)
      t.ok(int >= boundaries[i].min)
      t.ok(int < boundaries[i].max)
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
  t.deepEqual(lib._setup(0, 7), {bytesNeeded: 1, min: 0, max: 7, target: 7})
  t.deepEqual(lib._setup(0, 255), {bytesNeeded: 1, min: 0, max: 255, target: 255})
  t.deepEqual(lib._setup(0, 256), {bytesNeeded: 2, min: 0, max: 256, target: 256})
  t.deepEqual(lib._setup(0, 65535), {bytesNeeded: 2, min: 0, max: 65535, target: 65535})
  t.deepEqual(lib._setup(0, 65536), {bytesNeeded: 3, min: 0, max: 65536, target: 65536})
  t.deepEqual(lib._setup(0, 4294967295), {bytesNeeded: 4, min: 0, max: 4294967295, target: 4294967295})
  t.deepEqual(lib._setup(0, 4294967296), {bytesNeeded: 5, min: 0, max: 4294967296, target: 4294967296})

  t.deepEqual(lib._setup(void 0, 7), {bytesNeeded: 1, min: 0, max: 7, target: 7})
  t.deepEqual(lib._setup(0, void 0), {bytesNeeded: 7, min: 0, max: Number.MAX_SAFE_INTEGER, target: Number.MAX_SAFE_INTEGER})

  t.deepEqual(lib._setup(1000, 65535), {bytesNeeded: 2, min: 1000, max: 65535, target: 64535})
  t.deepEqual(lib._setup(1, 65536), {bytesNeeded: 2, min: 1, max: 65536, target: 65535})

  t.end()
})
