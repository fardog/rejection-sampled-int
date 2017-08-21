const crypto = require('crypto')

const MAX_SAFE_INT = Math.pow(2, 48) - 1

module.exports = rejectionSampledInt

function rejectionSampledInt (min, max = MAX_SAFE_INT) {
  if (max > MAX_SAFE_INT) {
    throw new Error(
      `requested max ${max} exceeds the greatest supported value of ${MAX_SAFE_INT}`
    )
  } else if (min > max) {
    throw new Error(`min cannot be greater than max; ${min} > ${max}`)
  }

  const target = max - min
  const bytesNeeded = Math.ceil((Math.floor(Math.log2(target)) + 1) / 8)
  const buf = Buffer.alloc(6)

  while (true) {
    const rand = crypto.randomBytes(bytesNeeded)

    buf.fill(rand, 6 - bytesNeeded)

    const int = buf.readUIntBE(0, 6) + min

    if (int < max) {
      return int
    }

    buf.fill(0)
  }
}
