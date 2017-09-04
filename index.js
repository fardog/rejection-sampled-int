var crypto = require('crypto')
var int53 = require('int53')

var MAX_SAFE_INT = Math.pow(2, 53) - 1

module.exports = rejectionSampledInt
module.exports.sync = rejectionSampledIntSync
module.exports._setup = _setup

function _setup (_opts) {
  var opts = _opts || {}
  var min = opts.min || 0
  var max = opts.max || MAX_SAFE_INT

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
  if (typeof _opts === 'function') {
    _ready = _opts
    _opts = {}
  }

  var opts = _setup(_opts)
  var ready = _ready

  if (ready) {
    return begin(ready.bind(this, null), ready.bind(this))
  }
  return new Promise(begin)

  function begin (resolve, reject) {
    process.nextTick(sample.bind(null, opts, resolve, reject))

    function sample (o, res, rej) {
      var buf = Buffer.alloc(8)

      crypto.randomBytes(o.bytesNeeded, onRand)

      function onRand (err, rand) {
        if (err) return rej(err)

        var int

        rand.copy(buf, 8 - opts.bytesNeeded)

        try {
          int = int53.readUInt64BE(buf)
        } catch (e) { }

        if (int < opts.target) {
          return res(int + o.min)
        }

        process.nextTick(sample.bind(null, o, res, rej))
      }
    }
  }
}

function rejectionSampledIntSync (_opts) {
  var opts = _setup(_opts)
  var buf = Buffer.alloc(8)

  while (true) {
    var rand = crypto.randomBytes(opts.bytesNeeded)
    var int

    rand.copy(buf, 8 - opts.bytesNeeded)

    try {
      int = int53.readUInt64BE(buf)
    } catch (e) {}

    if (int < opts.target) {
      return int + opts.min
    }

    buf.fill(0)
  }
}
