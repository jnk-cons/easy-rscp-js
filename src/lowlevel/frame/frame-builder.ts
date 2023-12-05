import {Data} from '../../api/frame/data';
import {FIXED_VALUES} from '../../api/helper/ByteHelper';
import {DataParser} from '../../api/frame/data-parser';
import {DefaultDataParser} from './default-data-parser';
import {Frame} from '../../api/frame/frame';

export class FrameBuilder {

    private ts?: Date
    private data: Data[] = []
    private controlBytes = FIXED_VALUES.controlBytesWithChecksum
    private parser: DataParser = new DefaultDataParser()

    withParser(parser: DataParser): FrameBuilder {
        this.parser = parser
        return this
    }

    timestamp(timestamp: Date): FrameBuilder {
        this.ts = timestamp
        return this
    }

    addData(...toAdd: Data[]): FrameBuilder {
        this.data.push(...toAdd)
        return this
    }

    enableChecksum(): FrameBuilder {
        this.controlBytes = FIXED_VALUES.controlBytesWithChecksum
        return this
    }

    disableChecksum(): FrameBuilder {
        this.controlBytes = FIXED_VALUES.controlBytesWithoutChecksum
        return this
    }

    withChecksumEnabled(enabled: boolean): FrameBuilder {
        if (enabled) {
            return this.enableChecksum()
        }
        return this.disableChecksum()
    }

    build(): Frame {
        return new Frame(
            this.ts ?? new Date(),
            this.controlBytes,
            this.data,
            this.parser)
    }

}
