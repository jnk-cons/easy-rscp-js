import {Data} from '../../../src/api/frame/data';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {DataType} from '../../../src/api/frame/DataType';
import {
    bigIntToHex,
    booleanToHex,
    FIXED_VALUES,
    numberToHex,
    stringToHex,
    timestampToHex
} from '../../../src/api/helper/ByteHelper';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {Frame} from '../../../src/api/frame/frame';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {DBTag} from '../../../src/api/frame/tags/DBTag';

describe('frame formatting - with checksum', function() {
    it('single data', function () {
        const expected = 'e3dc00112b6adf6400000000000000000800010086030101000155519433'

        const timestamp = new Date(1692363307000)
        const singleData = new DataBuilder().tag(BatTag.DEVICE_CONNECTED).boolean(true).build()

        const frame = new Frame(timestamp, FIXED_VALUES.controlBytesWithChecksum, [singleData])
        const result = frame.asRSCPFormattedHexString()

        expect(result).toBe(expected)
    })

    it('multiple data', function () {
        const expected = 'e3dc00112b6adf640000000000000000300001008603010100010100040304020064000c0080030d180045787472656d6520706f77657266756c2062617474657279e08ab95f'

        const timestamp = new Date(1692363307000)
        const d1 = new DataBuilder().tag(BatTag.DEVICE_CONNECTED).boolean(true).build()
        const d2 = new DataBuilder().tag(BatTag.INDEX).int16(100).build()
        const d3 = new DataBuilder().tag(BatTag.DEVICE_NAME).string("Extreme powerful battery").build()

        const frame = new Frame(timestamp, FIXED_VALUES.controlBytesWithChecksum, [d1, d2, d3])
        const result = frame.asRSCPFormattedHexString()

        expect(result).toBe(expected)
    })
})

describe('frame formatting - without checksum', function() {
    it('single data', function () {
        const expected = 'e3dc00102b6adf64000000000000000008000100860301010001'

        const timestamp = new Date(1692363307000)
        const singleData = new DataBuilder().tag(BatTag.DEVICE_CONNECTED).boolean(true).build()

        const frame = new Frame(timestamp, FIXED_VALUES.controlBytesWithoutChecksum, [singleData])
        const result = frame.asRSCPFormattedHexString()

        expect(result).toBe(expected)
    })

    it('multiple data', function () {
        const expected = 'e3dc00102b6adf640000000000000000300001008603010100010100040304020064000c0080030d180045787472656d6520706f77657266756c2062617474657279'

        const timestamp = new Date(1692363307000)
        const d1 = new DataBuilder().tag(BatTag.DEVICE_CONNECTED).boolean(true).build()
        const d2 = new DataBuilder().tag(BatTag.INDEX).int16(100).build()
        const d3 = new DataBuilder().tag(BatTag.DEVICE_NAME).string("Extreme powerful battery").build()

        const frame = new Frame(timestamp, FIXED_VALUES.controlBytesWithoutChecksum, [d1, d2, d3])
        const result = frame.asRSCPFormattedHexString()

        expect(result).toBe(expected)
    })
})

describe('frame - dataByTag', function() {
    const timestamp = new Date(1692363307000)
    it('find toplevel', function () {
        const otherData = new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32))
        const targetData = new Data(BatTag.DEVICE_NAME, DataType.STRING, stringToHex('test'))
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [otherData, targetData])

        const result = frame.dataByTag(BatTag.DEVICE_NAME)
        expect(result).toEqual(targetData)
    })

    it('find on level 1', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DEVICE_NAME, DataType.STRING, stringToHex('test'))
        const containerData = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const container = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerData)
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                container
            ]
        )

        const result = frame.dataByTag(BatTag.DEVICE_NAME, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(targetData)
    })

    it('find on level 2', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DEVICE_NAME, DataType.STRING, stringToHex('test'))
        const containerLevel2Data = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const containerLevel2 = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerLevel2Data)

        const grid = new Data(EMSTag.POWER_GRID, DataType.INT32, numberToHex(33, DataType.INT32))
        const containerLevel1Data = grid.asRSCPFormattedHexString() + containerLevel2.asRSCPFormattedHexString()
        const containerLevel1 = new Data(DBTag.HISTORY_DATA_WEEK, DataType.CONTAINER, containerLevel1Data)

        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                containerLevel1
            ]
        )

        const result = frame.dataByTag(BatTag.DEVICE_NAME, DBTag.HISTORY_DATA_WEEK, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(targetData)
    })
})

describe('frame - numberByTag', function() {
    const timestamp = new Date(1692363307000)
    it('find toplevel', function () {
        const otherData = new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.INT32, numberToHex(5, DataType.INT32))
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [otherData, targetData])

        const result = frame.numberByTag(BatTag.DCB_INDEX)
        expect(result).toEqual(5)
    })

    it('find on level 1', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.INT32, numberToHex(5, DataType.INT32))
        const containerData = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const container = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerData)
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                container
            ]
        )

        const result = frame.numberByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(5)
    })

    it('find on level 2', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.INT32, numberToHex(5, DataType.INT32))
        const containerLevel2Data = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const containerLevel2 = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerLevel2Data)

        const grid = new Data(EMSTag.POWER_GRID, DataType.INT32, numberToHex(33, DataType.INT32))
        const containerLevel1Data = grid.asRSCPFormattedHexString() + containerLevel2.asRSCPFormattedHexString()
        const containerLevel1 = new Data(DBTag.HISTORY_DATA_WEEK, DataType.CONTAINER, containerLevel1Data)

        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                containerLevel1
            ]
        )

        const result = frame.numberByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_WEEK, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(5)
    })
})

describe('frame - bigIntByTag', function() {
    const timestamp = new Date(1692363307000)
    it('find toplevel', function () {
        const otherData = new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.INT64, bigIntToHex(BigInt(5), DataType.INT64))
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [otherData, targetData])

        const result = frame.bigIntByTag(BatTag.DCB_INDEX)
        expect(result).toEqual(BigInt(5))
    })

    it('find on level 1', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.INT64, bigIntToHex(BigInt(5), DataType.INT64))
        const containerData = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const container = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerData)
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                container
            ]
        )

        const result = frame.bigIntByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(BigInt(5))
    })

    it('find on level 2', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.INT64, bigIntToHex(BigInt(5), DataType.INT64))
        const containerLevel2Data = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const containerLevel2 = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerLevel2Data)

        const grid = new Data(EMSTag.POWER_GRID, DataType.INT32, numberToHex(33, DataType.INT32))
        const containerLevel1Data = grid.asRSCPFormattedHexString() + containerLevel2.asRSCPFormattedHexString()
        const containerLevel1 = new Data(DBTag.HISTORY_DATA_WEEK, DataType.CONTAINER, containerLevel1Data)

        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                containerLevel1
            ]
        )

        const result = frame.bigIntByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_WEEK, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(BigInt(5))
    })
})

describe('frame - booleanByTag', function() {
    const timestamp = new Date(1692363307000)
    it('find toplevel', function () {
        const otherData = new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.BOOL, booleanToHex(true))
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [otherData, targetData])

        const result = frame.booleanByTag(BatTag.DCB_INDEX)
        expect(result).toBeTrue()
    })

    it('find on level 1', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.BOOL, booleanToHex(true))
        const containerData = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const container = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerData)
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                container
            ]
        )

        const result = frame.booleanByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_DAY)
        expect(result).toBeTrue()
    })

    it('find on level 2', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.BOOL, booleanToHex(true))
        const containerLevel2Data = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const containerLevel2 = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerLevel2Data)

        const grid = new Data(EMSTag.POWER_GRID, DataType.INT32, numberToHex(33, DataType.INT32))
        const containerLevel1Data = grid.asRSCPFormattedHexString() + containerLevel2.asRSCPFormattedHexString()
        const containerLevel1 = new Data(DBTag.HISTORY_DATA_WEEK, DataType.CONTAINER, containerLevel1Data)

        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                containerLevel1
            ]
        )

        const result = frame.booleanByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_WEEK, DBTag.HISTORY_DATA_DAY)
        expect(result).toBeTrue()
    })
})

describe('frame - stringByTag', function() {
    const timestamp = new Date(1692363307000)
    it('find toplevel', function () {
        const otherData = new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.STRING, stringToHex('test'))
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [otherData, targetData])

        const result = frame.stringByTag(BatTag.DCB_INDEX)
        expect(result).toBe('test')
    })

    it('find on level 1', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.STRING, stringToHex('test'))
        const containerData = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const container = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerData)
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                container
            ]
        )

        const result = frame.stringByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_DAY)
        expect(result).toBe('test')
    })

    it('find on level 2', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.STRING, stringToHex('test'))
        const containerLevel2Data = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const containerLevel2 = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerLevel2Data)

        const grid = new Data(EMSTag.POWER_GRID, DataType.INT32, numberToHex(33, DataType.INT32))
        const containerLevel1Data = grid.asRSCPFormattedHexString() + containerLevel2.asRSCPFormattedHexString()
        const containerLevel1 = new Data(DBTag.HISTORY_DATA_WEEK, DataType.CONTAINER, containerLevel1Data)

        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                containerLevel1
            ]
        )

        const result = frame.stringByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_WEEK, DBTag.HISTORY_DATA_DAY)
        expect(result).toBe('test')
    })
})

describe('frame - timestampByTag', function() {
    const timestamp = new Date(1692363307000)
    const timestampToFind = new Date(1692364307000)
    it('find toplevel', function () {
        const otherData = new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.TIMESTAMP, timestampToHex(timestampToFind))
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [otherData, targetData])

        const result = frame.timestampByTag(BatTag.DCB_INDEX)
        expect(result).toEqual(timestampToFind)
    })

    it('find on level 1', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.TIMESTAMP, timestampToHex(timestampToFind))
        const containerData = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const container = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerData)
        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                container
            ]
        )

        const result = frame.timestampByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(timestampToFind)
    })

    it('find on level 2', function () {
        const pv = new Data(EMSTag.POWER_PV, DataType.INT32, numberToHex(12, DataType.INT32))
        const targetData = new Data(BatTag.DCB_INDEX, DataType.TIMESTAMP, timestampToHex(timestampToFind))
        const containerLevel2Data = pv.asRSCPFormattedHexString() + targetData.asRSCPFormattedHexString()
        const containerLevel2 = new Data(DBTag.HISTORY_DATA_DAY, DataType.CONTAINER, containerLevel2Data)

        const grid = new Data(EMSTag.POWER_GRID, DataType.INT32, numberToHex(33, DataType.INT32))
        const containerLevel1Data = grid.asRSCPFormattedHexString() + containerLevel2.asRSCPFormattedHexString()
        const containerLevel1 = new Data(DBTag.HISTORY_DATA_WEEK, DataType.CONTAINER, containerLevel1Data)

        const frame = new Frame(
            timestamp,
            FIXED_VALUES.controlBytesWithoutChecksum,
            [
                new Data(EMSTag.POWER_HOME, DataType.INT32, numberToHex(450, DataType.INT32)),
                containerLevel1
            ]
        )

        const result = frame.timestampByTag(BatTag.DCB_INDEX, DBTag.HISTORY_DATA_WEEK, DBTag.HISTORY_DATA_DAY)
        expect(result).toEqual(timestampToFind)
    })
})
