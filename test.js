var test = require('tape')

var lib = require('./')

var TEST_ITERATIONS = Number.parseInt(process.env.TEST_ITERATIONS)
if (Number.isNaN(TEST_ITERATIONS)) {
  TEST_ITERATIONS = 100
}

test('returns integer', t => {
  var i = 0
  var ct = 0
  while (i < TEST_ITERATIONS) {
    lib({min: 0}, (err, int) => {
      t.ok(!err)
      t.ok(Number.isInteger(int))
      t.ok(Number.isSafeInteger(int))
      if (++ct === TEST_ITERATIONS) {
        t.end()
      }
    })
    ++i
  }
})

test('returns expected values given boundaries', t => {
  var boundaries = [7, 127, 255, 256, 65535, 65536, 4294967295, 4294967296]
  var ct = 0

  for (var i = 0; i < boundaries.length; ++i) {
    var j = 0
    while (j < TEST_ITERATIONS) {
      ((high) => {
        lib({min: 0, max: high}, (err, int) => {
          t.ok(!err)
          t.ok(int < high)
          if (++ct === boundaries.length * TEST_ITERATIONS) t.end()
        })
      })(boundaries[i])
      ++j
    }
  }
})

test('returns expected values given min boundaries', t => {
  var boundaries = [
    {min: 2, max: 7},
    {min: 10, max: 127},
    {min: 200, max: 255},
    {min: 100, max: 256},
    {min: 1000, max: 66536}
  ]
  var ct = 0

  for (var i = 0; i < boundaries.length; ++i) {
    ((boundary) => {
      var j = 0
      while (j < TEST_ITERATIONS) {
        lib(boundary, (err, int) => {
          t.ok(!err)
          t.ok(int >= boundary.min)
          t.ok(int < boundary.max)
          if (++ct === boundaries.length * TEST_ITERATIONS) t.end()
        })
        ++j
      }
    })(boundaries[i])
  }
})

test('allows omitting options', t => {
  lib((err, int) => {
    t.ok(!err)
    t.ok(Number.isInteger(int))
    t.ok(Number.isSafeInteger(int))
    t.end()
  })
})

test('returns promise when ready is omitted', t => {
  lib().then(int => {
    t.ok(Number.isInteger(int))
    t.ok(Number.isSafeInteger(int))
    t.end()
  }).catch(e => t.fail(e))
})

test('accepts options with promise', t => {
  lib({min: 1, max: 16}).then(int => {
    t.ok(int >= 1)
    t.ok(int < 16)
    t.end()
  }).catch(e => t.fail(e))
})

test('sync: returns integer', t => {
  var i = 0
  while (i < TEST_ITERATIONS) {
    var int = lib.sync()

    t.ok(Number.isInteger(int))
    t.ok(Number.isSafeInteger(int))
    ++i
  }

  t.end()
})

test('sync: returns expected values given boundaries', t => {
  var boundaries = [7, 127, 255, 256, 65535, 65536, 4294967295, 4294967296]

  for (var i = 0; i < boundaries.length; ++i) {
    var j = 0
    while (j < TEST_ITERATIONS) {
      t.ok(lib.sync({min: 0, max: boundaries[i]}) < boundaries[i])
      ++j
    }
  }

  t.end()
})

test('sync: returns expected values given min boundaries', t => {
  var boundaries = [
    {min: 2, max: 7},
    {min: 10, max: 127},
    {min: 200, max: 255},
    {min: 100, max: 256},
    {min: 1000, max: 66536}
  ]

  for (var i = 0; i < boundaries.length; ++i) {
    var j = 0
    while (j < TEST_ITERATIONS) {
      var int = lib.sync(boundaries[i])
      t.ok(int >= boundaries[i].min)
      t.ok(int < boundaries[i].max)
      ++j
    }
  }

  t.end()
})

test('sync: throws on too large max', t => {
  t.throws(() => lib._setup({min: 0, max: Number.MAX_SAFE_INTEGER + 1}))
  t.throws(() => lib.sync({min: 0, max: Number.MAX_SAFE_INTEGER + 1}))
  t.throws(() => lib({min: 0, max: Number.MAX_SAFE_INTEGER + 1}, () => {}))
  t.end()
})

test('throws on min > max', t => {
  t.throws(() => lib._setup({min: 10, max: 2}))
  t.throws(() => lib.sync({min: 10, max: 2}))
  t.throws(() => lib({min: 10, max: 2}, () => {}))
  t.end()
})

test('setup calculations', t => {
  t.deepEqual(lib._setup({min: 0, max: 7}), {bytesNeeded: 1, min: 0, max: 7, target: 7})
  t.deepEqual(lib._setup({min: 0, max: 255}), {bytesNeeded: 1, min: 0, max: 255, target: 255})
  t.deepEqual(lib._setup({min: 0, max: 256}), {bytesNeeded: 2, min: 0, max: 256, target: 256})
  t.deepEqual(lib._setup({min: 0, max: 65535}), {bytesNeeded: 2, min: 0, max: 65535, target: 65535})
  t.deepEqual(lib._setup({min: 0, max: 65536}), {bytesNeeded: 3, min: 0, max: 65536, target: 65536})
  t.deepEqual(lib._setup({min: 0, max: 4294967295}), {bytesNeeded: 4, min: 0, max: 4294967295, target: 4294967295})
  t.deepEqual(lib._setup({min: 0, max: 4294967296}), {bytesNeeded: 5, min: 0, max: 4294967296, target: 4294967296})

  t.deepEqual(lib._setup({max: 7}), {bytesNeeded: 1, min: 0, max: 7, target: 7})
  t.deepEqual(lib._setup({min: 0}), {bytesNeeded: 7, min: 0, max: Number.MAX_SAFE_INTEGER, target: Number.MAX_SAFE_INTEGER})

  t.deepEqual(lib._setup({min: 1000, max: 65535}), {bytesNeeded: 2, min: 1000, max: 65535, target: 64535})
  t.deepEqual(lib._setup({min: 1, max: 65536}), {bytesNeeded: 2, min: 1, max: 65536, target: 65535})

  t.end()
})
