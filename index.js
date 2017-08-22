const crypto = require('crypto')
const int53 = require('int53')

const MAX_SAFE_INT = Math.pow(2, 53) - 1

module.exports = randomRejectionSampledInt

function _setup (min, max) {
  if (max > MAX_SAFE_INT) {
    throw new Error(
      `requested max ${max} exceeds the greatest supported value of ${MAX_SAFE_INT}`
    )
  } else if (min > max) {
    throw new Error(`min cannot be greater than max; ${min} > ${max}`)
  }

  const target = max - min

  return {bytesNeeded: Math.ceil((Math.floor(Math.log2(target)) + 1) / 8)}
}

function randomRejectionSampledInt (min = 0, max = MAX_SAFE_INT) {
  const {bytesNeeded} = _setup(min, max)
  const buf = Buffer.alloc(8)

  while (true) {
    const rand = crypto.randomBytes(bytesNeeded)
    let int

    buf.fill(rand, 8 - bytesNeeded)

    try {
      int = int53.readUInt64BE(buf)
    } catch (e) {}

    if (int < max) {
      return int
    }

    buf.fill(0)
  }
}
