import {Data} from './data';
import {DataParser} from './data-parser';
import {DefaultDataParser} from '../../lowlevel/frame/default-data-parser';
import {FIXED_VALUES, numberToHex, POSITIONS, SIZES, timestampToHex} from '../helper/ByteHelper';
import {DataType} from './DataType';
import {buf as crc32} from 'crc-32'
import {ResultCode} from '../service/model/result-code';
import {Duration} from './duration';

export class Frame {
    constructor(
        public timestamp: Date,
        public controlBytes: string,
        public data: Data[],
        public parser: DataParser = new DefaultDataParser()) {
    }

    asRSCPFormattedHexString(): string {
        const dataHex = this.dataBlockAsRSCPFormattedHexString()
        const dataSize = dataHex.length / 2
        const frameSize = SIZES.completeHeaderSize() + dataSize
        let buffer = Buffer.alloc(frameSize)


        buffer.write(FIXED_VALUES.magicBytes, 'hex')
        buffer.write(this.controlBytes, POSITIONS.frameHeaderControlBytes,'hex')
        buffer.write(timestampToHex(this.timestamp), POSITIONS.frameHeaderTimestampEpochSeconds, 'hex')
        buffer.write(numberToHex(dataSize, DataType.UINT16), POSITIONS.frameHeaderDataLength, 'hex')
        buffer.write(dataHex, POSITIONS.frameDataSection(), 'hex')
        if (this.isChecksumEnabled()) {
            let checksum = crc32(buffer);
            const crcBuffer = Buffer.alloc(4)
            crcBuffer.writeInt32LE(checksum)
            buffer = Buffer.concat([buffer, crcBuffer])
        }

        return buffer.toString('hex')
    }


    private dataBlockAsRSCPFormattedHexString(): string {
        let result = ''
        this.data.forEach(current => {
            result += current.asRSCPFormattedHexString()
        })
        return result
    }


    private find(tag: string, blocks: Data[], ...containerPath: string[]): Data | undefined {
        if (containerPath.length == 0) {
            return blocks.find( d => d.tag === tag )
        }
        const currentTag = containerPath[0]
        const container = blocks.find(d => d.tag == currentTag)
        if (container) {
            return this.find(tag, container.valueAsContainer(this.parser), ...containerPath.slice(1))
        }
        return undefined
    }

    dataByTag(tag: string, ...containerPath: string[]): Data | undefined {
        return this.find(tag, this.data, ...containerPath)
    }

    numberByTag(tag: string, ...containerPath: string[]): number {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            return block.valueAsNumber()
        }
        return 0
    }

    bigIntByTag(tag: string, ...containerPath: string[]): bigint {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            return block.valueAsBigInt()
        }
        return BigInt(0)
    }

    booleanByTag(tag: string, ...containerPath: string[]): boolean {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            return block.valueAsBoolean()
        }
        return false
    }

    stringByTag(tag: string, ...containerPath: string[]): string {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            return block.valueAsString()
        }
        return ''
    }

    timestampByTag(tag: string, ...containerPath: string[]): Date {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            const ts = block.valueAsTimestamp()
            if (ts != null) {
                return ts
            }
        }
        return new Date()
    }

    durationByTag(tag: string, ...containerPath: string[]): Duration {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            const ts = block.valueAsDuration()
            if (ts != null) {
                return ts
            }
        }
        return {
            seconds: 0,
            nanos: 0
        }
    }

    containerByTag(tag: string, ...containerPath: string[]): Data[] {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            return block.valueAsContainer(this.parser)
        }
        return []
    }

    resultCodeByTag(tag: string, ...containerPath: string[]): ResultCode {
        const block = this.find(tag, this.data, ...containerPath)
        if (block) {
            return block.valueAsResultCode()
        }
        return ResultCode.UNKNOWN
    }

    isChecksumEnabled(): boolean {
        return this.controlBytes == FIXED_VALUES.controlBytesWithChecksum
    }
}
