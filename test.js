const test = require('tape')

const lib = require('./')

test('returns expected values', t => {
  const boundaries = [127, 128, 255, 256, 2048, 10240, 102400, 1024000]

  for (const boundary of boundaries) {
    for (let i = 0; i < 100; ++i) {
      t.ok(lib(0, boundary) < boundary)
    }
  }

  t.end()
})
