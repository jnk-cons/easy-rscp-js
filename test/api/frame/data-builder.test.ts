import {DataType} from '../../../src/api/frame/DataType';
import {bigIntToHex, booleanToHex, numberToHex, stringToHex, timestampToHex} from '../../../src/api/helper/ByteHelper';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {BatTag} from '../../../src/api/frame/tags/BatTag';

describe('databuilder tests ', function() {
    it('raw value', function () {
        const input = stringToHex('test')
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).type(DataType.STRING).raw(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.STRING)
        expect(result.valueAsHex).toBe(input)
    })

    it('timestamp value', function () {
        const input = new Date()
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).timestamp(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.TIMESTAMP)
        expect(result.valueAsHex).toBe(timestampToHex(input))
    })

    it('none value', function () {
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).none().build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.NONE)
        expect(result.valueAsHex).toBe('')
    })

    it('boolean value', function () {
        const input = true
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).boolean(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.BOOL)
        expect(result.valueAsHex).toBe(booleanToHex(input))
    })

    it('uchar8 value', function () {
        const input = 4
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).uchar8(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.UCHAR8)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.UCHAR8))
    })

    it('char8 value', function () {
        const input = 4
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).char8(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.CHAR8)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.CHAR8))
    })

    it('uint16 value', function () {
        const input = 120
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).uint16(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.UINT16)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.UINT16))
    })

    it('int16 value', function () {
        const input = 120
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).int16(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.INT16)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.INT16))
    })

    it('uint32 value', function () {
        const input = 1286449211
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).uint32(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.UINT32)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.UINT32))
    })

    it('int32 value', function () {
        const input = 1286449211
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).int32(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.INT32)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.INT32))
    })

    it('uint64 value', function () {
        const input = BigInt(4782038422)
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).uint64(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.UINT64)
        expect(result.valueAsHex).toBe(bigIntToHex(input, DataType.UINT64))
    })

    it('int64 value', function () {
        const input = BigInt(4782038422)
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).int64(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.INT64)
        expect(result.valueAsHex).toBe(bigIntToHex(input, DataType.INT64))
    })

    it('float32 value', function () {
        const input = 20000.57
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).float32(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.FLOAT32)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.FLOAT32))
    })

    it('double64 value', function () {
        const input = 20321452000.57
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).double64(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.DOUBLE64)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.DOUBLE64))
    })

    it('string value', function () {
        const input = 'test'
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).string(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.STRING)
        expect(result.valueAsHex).toBe(stringToHex(input))
    })

    it('build() throws error if tag is missing', function () {
        try {
            new DataBuilder().string('test').build()
        } catch (e) {
            // @ts-ignore
            expect(e.message).toBe('tag is required')
        }
    })

    it('build() throws error if type is missing', function () {
        try {
            new DataBuilder().tag(BatTag.DEVICE_NAME).string('test').type('').build()
        } catch (e) {
            // @ts-ignore
            expect(e.message).toBe('type is required')
        }
    })

    it('using none() if value is missing', function () {
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.NONE)
        expect(result.valueAsHex).toBe('')
    })

    it('float32 value', function () {
        const input = 20000.57
        const result = new DataBuilder().tag(BatTag.DEVICE_NAME).float32(input).build()

        expect(result.tag).toBe(BatTag.DEVICE_NAME)
        expect(result.type).toBe(DataType.FLOAT32)
        expect(result.valueAsHex).toBe(numberToHex(input, DataType.FLOAT32))
    })
})

