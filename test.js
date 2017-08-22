const test = require('tape')

const lib = require('./')

test('returns integer', t => {
  for (let i = 0; i < 100; ++i) {
    const int = lib()

    t.ok(Number.isInteger(int))
    t.ok(Number.isSafeInteger(int))
  }

  t.end()
})

test('returns expected values given boundaries', t => {
  const boundaries = [127, 128, 255, 256, 2048, 10240, 102400, 1024000, 10240000]

  for (const boundary of boundaries) {
    for (let i = 0; i < 100; ++i) {
      t.ok(lib(0, boundary) < boundary)
    }
  }

  t.end()
})

test('throws on too large max', t => {
  t.throws(() => lib(0, Number.MAX_SAFE_INTEGER + 1))
  t.end()
})

test('throws on min > max', t => {
  t.throws(() => lib(10, 2))
  t.end()
})
