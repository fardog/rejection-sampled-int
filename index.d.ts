// Type definitions for rejection-sampled-int 0.1.1
// Project: rejection-sampled-int
// Definitions by: Nathan Wittstock <fardog.io>

export as namespace rejectionSampledInt
export = rejectionSampledInt

declare interface rejectionSampledInt {
    (opts?: rejectionSampledInt.Options, ready: rejectionSampledInt.ReadyFn): void
    (opts?: rejectionSampledInt.Options): Promise<number>
    sync(opts?: rejectionSampledInt.Options): number
}

declare namespace rejectionSampledInt {
    export interface Options {
        min?: number
        max?: number
    }
    export type ReadyFn = (err: Error, int: number) => void
}
