// Type definitions for rejection-sampled-int
// Project: rejection-sampled-int
// Definitions by: Nathan Wittstock <fardog.io>

export as namespace rejectionSampledIntLib
export = RejectionSampledInt

declare function RejectionSampledInt (ready: RejectionSampledInt.ReadyFn): void
declare function RejectionSampledInt (opts: RejectionSampledInt.Options, ready: RejectionSampledInt.ReadyFn): void
declare function RejectionSampledInt (opts?: RejectionSampledInt.Options): Promise<number>

declare namespace RejectionSampledInt {
    export function sync(opts?: Options): number

    export interface Options {
        min?: number
        max?: number
    }
    export type ReadyFn = (err: Error, int: number) => void
}
