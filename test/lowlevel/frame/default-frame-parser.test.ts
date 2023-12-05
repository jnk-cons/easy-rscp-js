import {DataType} from '../../../src/api/frame/DataType';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DefaultFrameParser} from '../../../src/lowlevel/frame/default-frame-parser';

describe('default frame parser - with checksums enabled', function() {
    const timestamp = new Date(1692363307000)
    it('parse single', function () {
        const data = new DataBuilder()
            .tag(BatTag.DEVICE_CONNECTED)
            .boolean(true)
            .build()

        const frame = new FrameBuilder()
            .timestamp(timestamp)
            .enableChecksum()
            .addData(data)
            .build()


        const asBytes = frame.asRSCPFormattedHexString()
        const result = new DefaultFrameParser().parseFrame(asBytes)
        expect(result).toEqual(frame)
    })

    it('parse three', function () {
        const data1 = new DataBuilder()
            .tag(BatTag.DEVICE_CONNECTED)
            .boolean(true)
            .build()

        const data2 = new DataBuilder()
            .tag(BatTag.INDEX)
            .int16(100)
            .build()

        const data3 = new DataBuilder()
            .tag(BatTag.DEVICE_NAME)
            .string("Extreme powerful battery")
            .build()

        const frame = new FrameBuilder()
            .timestamp(timestamp)
            .enableChecksum()
            .addData(data1, data2, data3)
            .build()


        const asBytes = frame.asRSCPFormattedHexString()
        const result = new DefaultFrameParser().parseFrame(asBytes)
        expect(result).toEqual(frame)
    })
})

describe('default frame parser - with checksums disabled', function() {
    const timestamp = new Date(1692363307000)
    it('parse single', function () {
        const data = new DataBuilder()
            .tag(BatTag.DEVICE_CONNECTED)
            .boolean(true)
            .build()

        const frame = new FrameBuilder()
            .timestamp(timestamp)
            .disableChecksum()
            .addData(data)
            .build()


        const asBytes = frame.asRSCPFormattedHexString()
        const result = new DefaultFrameParser().parseFrame(asBytes)
        expect(result).toEqual(frame)
    })

    it('parse three', function () {
        const data1 = new DataBuilder()
            .tag(BatTag.DEVICE_CONNECTED)
            .boolean(true)
            .build()

        const data2 = new DataBuilder()
            .tag(BatTag.INDEX)
            .int16(100)
            .build()

        const data3 = new DataBuilder()
            .tag(BatTag.DEVICE_NAME)
            .string("Extreme powerful battery")
            .build()

        const frame = new FrameBuilder()
            .timestamp(timestamp)
            .disableChecksum()
            .addData(data1, data2, data3)
            .build()


        const asBytes = frame.asRSCPFormattedHexString()
        const result = new DefaultFrameParser().parseFrame(asBytes)
        expect(result).toEqual(frame)
    })
})
