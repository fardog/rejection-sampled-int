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

This library includes [TypeScript](http://www.typescriptlang.org/) definitions,
and should be discovered automatically by the TypeScript compiler.

## Usage

```javascript
var rand = require('rejection-sampled-int')

rand.sync({max: 128}) // 56
rand.sync({min: 10, max: 16}) // 11
rand({min: 10, max: 16}, (err, int) => int) // 13
rand({min: 10, max: 16}).then(int => int) // 10
rand.sync() // 8882371922968183
```

### API

* `rand({min = 0, max = Number.MAX_SAFE_INT}, [ready(err, int)])` Get an integer
  between `min` (inclusive) and `max` (exclusive). If `ready` is not provided,
  a `Promise` is returned.
* `rand.sync({min = 0, max = Number.MAX_SAFE_INT})` Get an integer between `min`
  (inclusive) and `max` (exclusive), synchronously.

## License

MIT. See [LICENSE](./LICENSE) for details.
