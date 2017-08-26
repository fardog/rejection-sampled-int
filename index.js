var crypto = require('crypto')
var int53 = require('int53')

var MAX_SAFE_INT = Math.pow(2, 53) - 1

module.exports = rejectionSampledInt
module.exports.sync = sync
module.exports._setup = _setup

function _setup (_min, _max) {
  var min = _min || 0
  var max = _max || MAX_SAFE_INT

  if (max > MAX_SAFE_INT) {
    throw new Error(
      'requested max ' + max + ' exceeds the greatest supported value of ' +
      MAX_SAFE_INT
    )
  } else if (min > max) {
    throw new Error('min cannot be greater than max; ' + min + ' > ' + max)
  }

  return {
    min: min,
    max: max,
    target: max - min,
    bytesNeeded: Math.ceil((Math.floor(Math.log2(max - min)) + 1) / 8)
  }
}

function rejectionSampledInt (_opts, _ready) {
  var ready = _ready
  var opts = _opts || {}

  if (typeof ready !== 'function') {
    ready = _opts
    opts = {}
  }

  opts = _setup(opts.min, opts.max)

  process.nextTick(sample.bind(null, opts, ready))

  function sample (o, r) {
    var buf = Buffer.alloc(8)

    crypto.randomBytes(o.bytesNeeded, onRand)

    function onRand (err, rand) {
      if (err) return ready(err)

      var int

      buf.fill(rand, 8 - opts.bytesNeeded)

      try {
        int = int53.readUInt64BE(buf)
      } catch (e) {}

      if (int < opts.target) {
        return r(null, int + o.min)
      }

      process.nextTick(sample.bind(null, o, r))
    }
  }
}

function sync (_min, _max) {
  var opts = _setup(_min, _max)
  var buf = Buffer.alloc(8)

  while (true) {
    var rand = crypto.randomBytes(opts.bytesNeeded)
    var int

    buf.fill(rand, 8 - opts.bytesNeeded)

    try {
      int = int53.readUInt64BE(buf)
    } catch (e) {}

    if (int < opts.target) {
      return int + opts.min
    }

    buf.fill(0)
  }
}
