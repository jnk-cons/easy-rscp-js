import {Data} from '../../../src/api/frame/data';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {DataType} from '../../../src/api/frame/DataType';
import {bigIntToHex, booleanToHex, numberToHex, stringToHex, timestampToHex} from '../../../src/api/helper/ByteHelper';
import {BatTag} from '../../../src/api/frame/tags/BatTag';

describe('valueAsNumber', function() {
    it('as char8', function () {
        const input = 36
        const inputHex = numberToHex(input, DataType.CHAR8)
        const testObject = new Data(EMSTag.MODE, DataType.CHAR8, inputHex)
        const result = testObject.valueAsNumber()
        expect(result).toBe(input)
    })

    it('as uchar8', function () {
        const input = 36
        const inputHex = numberToHex(input, DataType.UCHAR8)
        const testObject = new Data(EMSTag.MODE, DataType.UCHAR8, inputHex)
        const result = testObject.valueAsNumber()
        expect(result).toBe(input)
    })

    it('as int16', function () {
        const input = 1267
        const inputHex = numberToHex(input, DataType.INT16)
        const testObject = new Data(EMSTag.MODE, DataType.INT16, inputHex)
        const result = testObject.valueAsNumber()
        expect(result).toBe(input)
    })

    it('as uint16', function () {
        const input = 1267
        const inputHex = numberToHex(input, DataType.UINT16)
        const testObject = new Data(EMSTag.MODE, DataType.UINT16, inputHex)
        const result = testObject.valueAsNumber()
        expect(result).toBe(input)
    })

    it('as int32', function () {
        const input = 1784217
        const inputHex = numberToHex(input, DataType.INT32)
        const testObject = new Data(EMSTag.MODE, DataType.INT32, inputHex)
        const result = testObject.valueAsNumber()
        expect(result).toBe(input)
    })

    it('as uint32', function () {
        const input = 1784217
        const inputHex = numberToHex(input, DataType.UINT32)
        const testObject = new Data(EMSTag.MODE, DataType.UINT32, inputHex)
        const result = testObject.valueAsNumber()
        expect(result).toBe(input)
    })
})

describe('valueAsBigInt', function() {
    it('as int64', function () {
        const input: bigint = BigInt(8842692343234323)
        const inputHex = bigIntToHex(input, DataType.INT64)
        const testObject = new Data(EMSTag.MODE, DataType.INT64, inputHex)
        const result = testObject.valueAsBigInt()
        expect(result).toBe(input)
    })

    it('as uInt64', function () {
        const input: bigint = BigInt(8842692343234323)
        const inputHex = bigIntToHex(input, DataType.UINT64)
        const testObject = new Data(EMSTag.MODE, DataType.UINT64, inputHex)
        const result = testObject.valueAsBigInt()
        expect(result).toBe(input)
    })

})

describe('valueAsBoolean', function() {
    it('as boolean (true)', function () {
        const inputHex = booleanToHex(true)
        const testObject = new Data(EMSTag.MODE, DataType.BOOL, inputHex)
        const result = testObject.valueAsBoolean()
        expect(result).toBeTrue()
    })

    it('as boolean (false)', function () {
        const inputHex = booleanToHex(false)
        const testObject = new Data(EMSTag.MODE, DataType.BOOL, inputHex)
        const result = testObject.valueAsBoolean()
        expect(result).toBeFalse()
    })

})

describe('valueAsTimestamp', function() {
    it('as Timestamp', function () {
        const input = new Date(1692363307000) // 2023-08-18T12:55:07.000Z
        const inputHex = timestampToHex(input)
        const testObject = new Data(EMSTag.MODE, DataType.TIMESTAMP, inputHex)
        const result = testObject.valueAsTimestamp()
        expect(result?.getTime()).toBe(input.getTime())
    })
})

describe('valueAsString', function() {
    it('as String', function () {
        const input = 'Hello world'
        const inputHex = stringToHex(input)
        const testObject = new Data(EMSTag.MODE, DataType.STRING, inputHex)
        const result = testObject.valueAsString()
        expect(result).toBe(input)
    })
})

describe('valueAsContainer', function() {
    it('as container', function () {
        const child1 = new Data(BatTag.DCB_INDEX, DataType.UINT16, numberToHex(1023, DataType.UINT16))
        const child2 = new Data(BatTag.DEVICE_NAME, DataType.STRING, '0c0080030d2d0065787472656d65206c6f6e6720737472696e6720666f722061206261747465727920646576696365206e616d65')
        const child3 = new Data(EMSTag.POWERSAVE_ENABLED, DataType.BOOL, booleanToHex(true))

        const container = new Data(EMSTag.GET_IDLE_PERIODS, DataType.CONTAINER, child1.asRSCPFormattedHexString() + child2.asRSCPFormattedHexString() + child3.asRSCPFormattedHexString())
        const result = container.valueAsContainer()

        expect(result.length).toBe(3)
        expect(result[0]).toEqual(child1)
        expect(result[1]).toEqual(child2)
        expect(result[2]).toEqual(child3)
    })
})

describe('asRSCPFormattedHexString', function() {
    it('uint16', function () {
        const input = 1024
        const inputHex = numberToHex(input, DataType.UINT16)
        const testObject = new Data(BatTag.DCB_INDEX, DataType.UINT16, inputHex)

        const result = testObject.asRSCPFormattedHexString()
        expect(result).toBe('000180030502000004')
    })

    it('string', function () {
        const input = 'extreme long string for a battery device name'
        const inputHex = stringToHex(input)
        const testObject = new Data(BatTag.DEVICE_NAME, DataType.STRING, inputHex)

        const result = testObject.asRSCPFormattedHexString()
        expect(result.toLowerCase()).toBe('0c0080030d2d0065787472656d65206c6f6e6720737472696e6720666f722061206261747465727920646576696365206e616d65')
    })
})
