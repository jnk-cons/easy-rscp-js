import {FrameParser} from '../../api/frame/frame-parser';
import {Frame} from '../../api/frame/frame';
import {DataParser} from '../../api/frame/data-parser';
import {DefaultDataParser} from './default-data-parser';
import {Data} from '../../api/frame/data';
import {FrameBuilder} from './frame-builder';
import {FIXED_VALUES, POSITIONS, SIZES} from '../../api/helper/ByteHelper';

export class DefaultFrameParser implements FrameParser {

    constructor(private dataParser: DataParser = new DefaultDataParser()) {
    }


    parseFrame(valueAsHex: string): Frame {
        const frame = Buffer.from(valueAsHex, 'hex')
        return new FrameBuilder()
            .withChecksumEnabled(this.isChecksumEnabled(frame))
            .withParser(this.dataParser)
            .timestamp(this.readTimestamp(frame))
            .addData(...this.readData(frame))
            .build()
    }

    private isChecksumEnabled(frame: Buffer): boolean {
        const controlBytes = frame.toString('hex', POSITIONS.frameHeaderControlBytes, POSITIONS.frameHeaderControlBytes + SIZES.frameHeaderControlBytes)
        return FIXED_VALUES.controlBytesWithChecksum == controlBytes
    }

    private readTimestamp(frame: Buffer): Date {
        const epochSeconds = Number(frame.readBigInt64LE(POSITIONS.frameHeaderTimestampEpochSeconds))
        const nanos = frame.readUInt32LE(POSITIONS.frameHeaderTimestampEpochNanos)
        const millis = epochSeconds * 1000 + nanos / 1000000
        return new Date(millis)
    }

    private readData(frame: Buffer): Data[] {
        const dataLength = frame.readUInt16LE(POSITIONS.frameHeaderDataLength)
        const dataSection = frame.toString('hex', POSITIONS.frameDataSection(), POSITIONS.frameDataSection() + dataLength)
        return this.dataParser.parseRSCPData(dataSection)
    }

}
