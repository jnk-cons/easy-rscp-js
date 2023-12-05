import {bigIntToHex, booleanToHex, numberToHex, stringToHex, timestampToHex} from '../../api/helper/ByteHelper';
import {DataType} from '../../api/frame/DataType';
import {Data} from '../../api/frame/data';
import {Duration} from '../../api/frame/duration';

export class DataBuilder {
    private tagAsHex?: string
    private typeAsHex?: string
    private valueAsHex?: string

    tag(tagHexString: string ): DataBuilder {
        this.tagAsHex = tagHexString
        return this
    }

    type(typeHexString: string ): DataBuilder {
        this.typeAsHex = typeHexString
        return this
    }

    raw(valueHexString: string): DataBuilder {
        this.valueAsHex = valueHexString
        return this
    }

    timestamp(timestamp: Date) : DataBuilder {
        this.valueAsHex = timestampToHex(timestamp)
        this.typeAsHex = DataType.TIMESTAMP
        return this
    }

    duration(duration: Duration): DataBuilder {
        const asDate = new Date(duration.seconds * 1000)
        return this.timestamp(asDate)
    }

    none() : DataBuilder {
        this.valueAsHex = ''
        this.typeAsHex = DataType.NONE
        return this
    }

    boolean(value: boolean): DataBuilder {
        this.valueAsHex = booleanToHex(value)
        this.typeAsHex = DataType.BOOL
        return this
    }

    uchar8(value: number): DataBuilder {
        return this.number(value, DataType.UCHAR8)
    }

    char8(value: number): DataBuilder {
        return this.number(value, DataType.CHAR8)
    }

    uint16(value: number): DataBuilder {
        return this.number(value, DataType.UINT16)
    }

    int16(value: number): DataBuilder {
        return this.number(value, DataType.INT16)
    }

    uint32(value: number): DataBuilder {
        return this.number(value, DataType.UINT32)
    }

    int32(value: number): DataBuilder {
        return this.number(value, DataType.INT32)
    }

    uint64(value: bigint): DataBuilder {
        return this.bigint(value, DataType.UINT64)
    }

    int64(value: bigint): DataBuilder {
        return this.bigint(value, DataType.INT64)
    }

    float32(value: number): DataBuilder {
        return this.number(value, DataType.FLOAT32)
    }

    double64(value: number): DataBuilder {
        return this.number(value, DataType.DOUBLE64)
    }

    string(value: string): DataBuilder {
        this.valueAsHex = stringToHex(value)
        this.typeAsHex = DataType.STRING
        return this
    }

    container(...childs: Data[]): DataBuilder {
        this.typeAsHex = DataType.CONTAINER
        if (this.valueAsHex === null || this.valueAsHex === undefined) {
            this.valueAsHex = ''
        }
        for(const child of childs) {
            this.valueAsHex += child.asRSCPFormattedHexString()
        }
        return this
    }

    build(): Data {
        if (this.valueAsHex === null || this.valueAsHex === undefined) {
            this.valueAsHex = ''
        }
        if (this.valueAsHex === '' && (this.typeAsHex === null || this.typeAsHex === undefined)) {
            this.typeAsHex = DataType.NONE
        }
        this.checkRequiredField(this.tagAsHex, 'tag')
        this.checkRequiredField(this.typeAsHex, 'type')
        return new Data(this.tagAsHex!!, this.typeAsHex!!, this.valueAsHex!!)
    }

    private checkRequiredField(valueToCheck: string | undefined, fieldName: string) {
        if (valueToCheck === null || valueToCheck === undefined || valueToCheck.trim().length === 0) {
            throw Error(`${fieldName} is required`)
        }
    }

    private number(value: number, type: DataType): DataBuilder {
        this.valueAsHex = numberToHex(value, type)
        this.typeAsHex = type
        return this
    }

    private bigint(value: bigint, type: DataType.INT64 | DataType.UINT64): DataBuilder {
        this.valueAsHex = bigIntToHex(value, type)
        this.typeAsHex = type
        return this
    }
}
