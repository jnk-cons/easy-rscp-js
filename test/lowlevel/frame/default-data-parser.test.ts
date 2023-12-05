import {DataType} from '../../../src/api/frame/DataType';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';

describe('default data parser tests ', function() {
    it('parse single', function () {
        const input = '00018003050200ff03'
        const parser = new DefaultDataParser()
        const result = parser.parseRSCPData(input)

        expect(result.length).toBe(1)
        const first = result[0]
        expect(first.tag).toBe(BatTag.DCB_INDEX)
        expect(first.type).toBe(DataType.UINT16)
        expect(first.valueAsNumber()).toBe(1023)
    })

    it('parse duo', function () {
        const input = '00018003050200ff03' + '0c0080030d2d0065787472656d65206c6f6e6720737472696e6720666f722061206261747465727920646576696365206e616d65'
        const parser = new DefaultDataParser()
        const result = parser.parseRSCPData(input)

        expect(result.length).toBe(2)
        const first = result[0]
        expect(first.tag).toBe(BatTag.DCB_INDEX)
        expect(first.type).toBe(DataType.UINT16)
        expect(first.valueAsNumber()).toBe(1023)

        const second = result[1]
        expect(second.tag).toBe(BatTag.DEVICE_NAME)
        expect(second.type).toBe(DataType.STRING)
        expect(second.valueAsString()).toBe('extreme long string for a battery device name')
    })

    it('parse three', function () {
        const input = '00018003050200ff03' + '0c0080030d2d0065787472656d65206c6f6e6720737472696e6720666f722061206261747465727920646576696365206e616d65' + '0401000101010001'
        const parser = new DefaultDataParser()
        const result = parser.parseRSCPData(input)

        expect(result.length).toBe(3)
        const first = result[0]
        expect(first.tag).toBe(BatTag.DCB_INDEX)
        expect(first.type).toBe(DataType.UINT16)
        expect(first.valueAsNumber()).toBe(1023)

        const second = result[1]
        expect(second.tag).toBe(BatTag.DEVICE_NAME)
        expect(second.type).toBe(DataType.STRING)
        expect(second.valueAsString()).toBe('extreme long string for a battery device name')

        const third = result[2]
        expect(third.tag).toBe(EMSTag.POWERSAVE_ENABLED)
        expect(third.type).toBe(DataType.BOOL)
        expect(third.valueAsBoolean()).toBeTrue()
    })

})

