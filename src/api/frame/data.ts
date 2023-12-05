import {DataType} from './DataType';
import {numberToHex} from '../helper/ByteHelper';
import {DataParser} from './data-parser';
import {DefaultDataParser} from '../../lowlevel/frame/default-data-parser';
import {ResultCode} from '../service/model/result-code';
import {Duration} from './duration';


export class Data {
    constructor(public tag: string, public type: string, public valueAsHex: string) {
        this.tag = this.tag.toUpperCase()
        this.type = this.type.toUpperCase()
        this.valueAsHex = this.valueAsHex.toUpperCase()
    }

    asRSCPFormattedHexString(): string {
        const tagBuffer = Buffer.from(this.tag, 'hex').reverse()
        return tagBuffer.toString('hex').toUpperCase() + this.type + this.buildLengthAsHex() + this.valueAsHex
    }

    size(): number {
        const hexToCalculate = this.valueAsHex ?? ''
        return hexToCalculate.length / 2
    }

    private buildLengthAsHex(): string {
        return numberToHex(this.size(), DataType.INT16)
    }

    valueAsNumber(): number {
        if (this.type === DataType.FLOAT32) {
            return this.valueAsFloat()
        }
        if (this.type === DataType.DOUBLE64) {
            return this.valueAsDouble()
        }
        if (this.isIntType()) {
            return this.valueAsInt()
        }
        return 0
    }

    valueAsBigInt(): bigint {
        if (this.isLongType()) {
            return this.valueAsLong();
        }
        return BigInt(0)
    }

    valueAsBoolean() : boolean {
        if (this.type === DataType.BOOL) {
            return Buffer.from(this.valueAsHex, 'hex').readInt8(0) === 1
        }
        return false
    }

    valueAsTimestamp(): Date | null {
        if (this.type === DataType.TIMESTAMP) {
            const buffer = Buffer.from(this.valueAsHex, 'hex')
            const epochSeconds = Number(buffer.readBigUInt64LE())
            const nanos = buffer.readUInt32LE(8)
            const millis = epochSeconds * 1000 + nanos / 1000000
            return new Date(millis)
        }
        return null
    }

    valueAsDuration(): Duration | null {
        if (this.type === DataType.TIMESTAMP) {
            const buffer = Buffer.from(this.valueAsHex, 'hex')
            const epochSeconds = Number(buffer.readBigUInt64LE())
            const nanos = buffer.readUInt32LE(8)
            return {
                seconds: epochSeconds,
                nanos: nanos
            }
        }
        return null
    }

    valueAsString(): string {
        if (this.isIntType()) {
            return this.valueAsNumber().toString()
        }
        else if (this.isLongType()) {
            return this.valueAsLong().toString()
        }
        else if (this.type == DataType.TIMESTAMP) {
            const ts = this.valueAsTimestamp()
            if (ts) {
                return ts.toString()
            }
        }
        else if (this.type == DataType.BOOL) {
            return this.valueAsBoolean().toString()
        }
        else if (this.type == DataType.STRING) {
            return Buffer.from(this.valueAsHex, 'hex').toString('utf-8')
        }

        return this.valueAsHex
    }

    valueAsContainer(parser: DataParser = new DefaultDataParser()): Data[] {
        if (this.type === DataType.CONTAINER) {
            return parser.parseRSCPData(this.valueAsHex)
        }
        return []
    }

    valueAsResultCode(): ResultCode {
        if (this.type == DataType.ERROR) {
            return ResultCode.UNKNOWN
        }
        const code = this.valueAsInt()
        if (Object.values(ResultCode).includes(code)) {
            return code
        }
        return ResultCode.UNKNOWN
    }

    private valueAsByte() : number {
        if (this.isByteType()) {
            return Buffer.from(this.valueAsHex, 'hex').readIntLE(0, 1)
        }
        return 0
    }

    private valueAsShort() : number {
        if (this.isByteType()) {
            return this.valueAsByte()
        }
        if (this.type === DataType.INT16) {
            return Buffer.from(this.valueAsHex, 'hex').readInt16LE(0)
        }
        else if (this.type === DataType.UINT16) {
            return Buffer.from(this.valueAsHex, 'hex').readUint16LE(0)
        }
        return 0
    }

    private valueAsInt() : number {
        if (this.isShortType()) {
            return this.valueAsShort()
        }
        if (this.type === DataType.INT32) {
            return Buffer.from(this.valueAsHex, 'hex').readInt32LE(0)
        }
        else if (this.type === DataType.UINT32) {
            return Buffer.from(this.valueAsHex, 'hex').readUInt32LE(0)
        }
        return 0
    }

    private valueAsLong() : bigint {
        if (this.isIntType()) {
            return BigInt(this.valueAsInt())
        }
        if (this.type === DataType.INT64) {
            return Buffer.from(this.valueAsHex, 'hex').readBigInt64LE(0)
        }
        else if (this.type === DataType.UINT64) {
            return Buffer.from(this.valueAsHex, 'hex').readBigUInt64LE(0)
        }
        return BigInt(0)
    }

    private valueAsFloat() : number {
        if (this.type === DataType.FLOAT32) {
            return Buffer.from(this.valueAsHex, 'hex').readFloatLE(0)
        }

        return 0.0
    }

    private valueAsDouble() : number {
        if (this.type.toUpperCase() === DataType.DOUBLE64.toUpperCase()) {
            return Buffer.from(this.valueAsHex, 'hex').readDoubleLE(0)
        }

        return 0.0
    }

    private isByteType(): boolean {
        return this.type == DataType.UCHAR8 || this.type == DataType.CHAR8
    }

    private isShortType(): boolean {
        return this.isByteType() || this.type == DataType.INT16 || this.type == DataType.UINT16
    }

    private isIntType(): boolean {
        return this.isShortType() || this.type == DataType.INT32 || this.type == DataType.UINT32
    }

    private isLongType(): boolean {
        return this.isIntType() || this.type == DataType.INT64 || this.type == DataType.UINT64
    }
}
