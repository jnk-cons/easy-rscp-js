import {DataParser} from '../../api/frame/data-parser';
import {Data} from '../../api/frame/data';
import {POSITIONS, SIZES} from '../../api/helper/ByteHelper';
import {DataBuilder} from './data-builder';

export class DefaultDataParser implements DataParser {
    parseRSCPData(valueAsHex: string): Data[] {
        const result: Data[] = []

        let bytesParsed = 0
        const value = Buffer.from(valueAsHex, 'hex')
        while(bytesParsed < value.length) {
            let parsedData = this.parseSingleData(value, bytesParsed)
            result.push(parsedData)
            bytesParsed += parsedData.asRSCPFormattedHexString().length / 2
        }

        return result;
    }

    private parseSingleData(value: Buffer, offset: number): Data {
        const tag = this.readTag(value, offset)
        const type = this.readType(value, offset)
        const length = this.readLength(value, offset)
        const singleValue = this.readValue(value, length, offset);
        return new DataBuilder()
            .tag(tag.toString('hex').toUpperCase())
            .type(type.toString('hex').toUpperCase())
            .raw(singleValue.toString('hex').toUpperCase())
            .build()
    }

    private readValue(value: Buffer, length: number, offset: number): Buffer {
        const start = offset + POSITIONS.dataValueSection()
        const end = start + length
        return value
            .subarray(start, end)
    }

    private readLength(value: Buffer, offset: number): number {
        const start = offset + POSITIONS.dataValueLength
        return value.readUint16LE(start)
    }

    private readType(value: Buffer, offset: number): Buffer {
        const start = offset + POSITIONS.dataType
        const end = start + SIZES.dataType
        return value
            .subarray(start, end)
            .reverse()
    }

    private readTag(value: Buffer, offset: number): Buffer {
        const start = offset + POSITIONS.dataTag
        const end = start + SIZES.dataTag
        return value
            .subarray(start, end)
            .reverse()
    }
}
