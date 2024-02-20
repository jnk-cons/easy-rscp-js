import {WbExternalDataParser} from '../../api/frame/wb-external-data-parser';
import {Data} from '../../api/frame/data';
import {WbExternalEnergyData} from '../../api/frame/wb-external-energy-data';
import {WBTag} from '../../api/frame/tags/WBTag';
import {tag2ReadableString} from '../../api/helper/type-helper';
import {DataParser} from '../../api/frame/data-parser';
import {DefaultDataParser} from './default-data-parser';

export class DefaultWbExternalDataParser implements WbExternalDataParser {

    constructor(private parser: DataParser = new DefaultDataParser()) {
    }

    parseEnergyData(block: Data): WbExternalEnergyData {
        if (this.isTagSupported(block)) {
            const byteBlock = block.valueAsContainer(this.parser)
                .find(value => value.tag == WBTag.EXTERN_DATA)

            if (byteBlock == undefined) {
                throw new Error('Required block of type ' + tag2ReadableString(WBTag.EXTERN_DATA) + ' does not exist in given container')
            }
            else if (byteBlock.size() < 6) {
                throw new Error('Length of the external data is to short. At least 6 bytes are needed. We found only ' + byteBlock.size())
            }
            const buffer = Buffer.from(byteBlock.valueAsHex, 'hex')
            return {
                powerW: buffer.readInt16LE(),
                totalEnergyWh: buffer.readInt32LE(2)
            }
        }
        throw new Error('Given datablock typ ' + tag2ReadableString(block.tag) + ' is not supported. Only '
            + tag2ReadableString(WBTag.EXTERN_DATA_SUN) + ', '
            + tag2ReadableString(WBTag.EXTERN_DATA_NET) + ' and '
            + tag2ReadableString(WBTag.EXTERN_DATA_ALL) + ' are supported')
    }

    private isTagSupported(block: Data): boolean {
        const containerTag = block.tag
        return containerTag == WBTag.EXTERN_DATA_SUN
            || containerTag == WBTag.EXTERN_DATA_NET
            || containerTag == WBTag.EXTERN_DATA_ALL
    }

}
