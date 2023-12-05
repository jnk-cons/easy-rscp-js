import {DataType} from '../frame/DataType';
import {buf} from 'crc-32';
import {Data} from '../frame/data';

export function bigIntToHex(value: bigint, type: DataType.INT64 | DataType.UINT64): string {
    const buffer = Buffer.alloc(8)
    if (type === DataType.INT64) {
        buffer.writeBigInt64LE(value)
    }
    else {
        buffer.writeBigInt64LE(value)
    }
    return buffer.toString('hex').toUpperCase()
}

export function numberToHex(value: number, type: DataType): string {
    let bufferSize
    if (DataType.CHAR8 === type || DataType.UCHAR8 === type) {
        bufferSize = 1
    }
    else if (DataType.INT16 == type || DataType.UINT16 === type) {
        bufferSize = 2
    }
    else if (DataType.INT32 == type || DataType.UINT32 === type) {
        bufferSize = 4
    }
    else if (DataType.FLOAT32 == type) {
        bufferSize = 4
    }
    else if (DataType.DOUBLE64 == type) {
        bufferSize = 8
    }
    else {
        throw new Error('Unsupported datatype ' + type)
    }
    const buffer = Buffer.alloc(bufferSize)

    if (DataType.CHAR8 === type) {
        buffer.writeIntLE(value, 0, 1)
    }
    else if (DataType.UCHAR8 === type) {
        buffer.writeUIntLE(value, 0, 1)
    }
    else if (DataType.INT16 === type) {
        buffer.writeInt16LE(value, 0)
    }
    else if (DataType.UINT16 === type) {
        buffer.writeUInt16LE(value, 0)
    }
    else if (DataType.INT32 === type) {
        buffer.writeInt32LE(value, 0)
    }
    else if (DataType.UINT32 === type) {
        buffer.writeUInt32LE(value, 0)
    }
    else if (DataType.FLOAT32 === type) {
        buffer.writeFloatLE(value, 0)
    }
    else if (DataType.DOUBLE64 === type) {
        buffer.writeDoubleLE(value, 0)
    }
    return buffer.toString('hex').toUpperCase()
}

export function booleanToHex(value: boolean): string {
    const buffer = Buffer.alloc(1)
    if (value) {
        buffer.writeInt8(1)
    }
    else {
        buffer.writeInt8(0)
    }
    return buffer.toString('hex').toUpperCase()
}

export function timestampToHex(value: Date): string {
    const buffer = Buffer.alloc(12)
    const epochSeconds = BigInt(Math.floor(value.getTime() / 1000))
    const nanos = (value.getTime() % 1000) * 1000000
    buffer.writeBigUInt64LE(epochSeconds)
    buffer.writeUInt32LE(nanos, 8)
    return buffer.toString('hex').toUpperCase()
}

export function stringToHex(value: string): string {
    return Buffer.from(value, 'utf-8').toString('hex').toUpperCase()
}

export const SIZES = {
    frameHeaderMagicBytes: 2,
    frameHeaderControlBytes: 2,
    frameHeaderDataLength: 2,
    timestampEpochSeconds: 8,
    timestampEpochNanos: 4,
    checksum: 4,
    dataTag: 4,
    dataType: 1,
    dataValueLength: 2,

    completeHeaderSize(): number {
        return this.frameHeaderMagicBytes +
            this.frameHeaderControlBytes +
            this.timestampEpochSeconds +
            this.timestampEpochNanos +
            this.frameHeaderDataLength
    }
}
export const POSITIONS = {
    frameHeaderMagicBytes: 0,
    frameHeaderControlBytes: SIZES.frameHeaderMagicBytes,
    frameHeaderTimestampEpochSeconds: SIZES.frameHeaderMagicBytes + SIZES.frameHeaderControlBytes,
    frameHeaderTimestampEpochNanos: SIZES.frameHeaderMagicBytes + SIZES.frameHeaderControlBytes + SIZES.timestampEpochSeconds,
    frameHeaderDataLength: SIZES.frameHeaderMagicBytes + SIZES.frameHeaderControlBytes + SIZES.timestampEpochSeconds + SIZES.timestampEpochNanos,
    dataTag: 0,
    dataType: SIZES.dataTag,
    dataValueLength: SIZES.dataTag + SIZES.dataType,

    frameDataSection(): number {
        return SIZES.completeHeaderSize()
    },

    dataValueSection(): number {
        return SIZES.dataTag + SIZES.dataType + SIZES.dataValueLength
    },
}

export const FIXED_VALUES = {
    magicBytes: 'E3DC',
    controlBytesWithChecksum: '0011',
    controlBytesWithoutChecksum: '0010'
}
