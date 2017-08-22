# rejection-sampled-int

[![Build Status](http://img.shields.io/travis/fardog/rejection-sampled-int/master.svg?style=flat-square)](https://travis-ci.org/fardog/rejection-sampled-int)
[![npm install](http://img.shields.io/npm/dm/rejection-sampled-int.svg?style=flat-square)](https://www.npmjs.org/package/rejection-sampled-int)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

Cryptographically random integers, chosen by a rejection sampling algorithm.

> **Warning:** I am not a cryptographer, or any sort of random number expert.
  An audit would be greatly appreciated.

## Installation

To install the module for use in your projects:

```bash
npm install rejection-sampled-int
```

## Usage

```javascript
var rand = require('rejection-sampled-int')

rand(0, 128) // 56
rand(10, 16) // 11
rand() // 8882371922968183
```

### API

* `rand(min = 0, max = Number.MAX_SAFE_INT)` Get an integer between `min`
  (inclusive) and `max` (exclusive).

## Notes

This is a sampling algorithm, meaning numbers are read from a pool of random
bytes large enough to get numbers in the requested range. However, samples
outside the requested range may be pulled, and must be rejected. This is how the
algorithm generates uniform random numbers, but it _does mean it will be slower
than other methods._ Use this library when you need a uniform distribution, but
avoid placing it in "hot" methods if performance is a concern.

## License

MIT. See [LICENSE](./LICENSE) for details.
