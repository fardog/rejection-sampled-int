// Type definitions for rejection-sampled-int 0.1.1
// Project: rejection-sampled-int
// Definitions by: Nathan Wittstock <fardog.io>

export as namespace randomRejectionSampledIntLib

export = randomRejectionSampledInt

declare function randomRejectionSampledInt(): number
declare function randomRejectionSampledInt(min: number, max?: number): number

declare namespace randomRejectionSampledInt {}
