import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {Data} from '../../api/frame/data';
import {DataParser} from '../../api/frame/data-parser';
import {DataType} from '../../api/frame/DataType';
import {determineDataTypeName, determineNamespaceName, determineTagName} from '../../api/helper/type-helper';

export class StringFrameConverter implements FrameConverter<string> {
    convert(frame: Frame): string {
        let result = 'Timestamp:\t' + frame.timestamp + '\n'
        result += 'WithChecksum:\t' + frame.isChecksumEnabled() + '\n'
        frame.data.forEach(d => {
            result += this.convertData(d, 1, frame.parser)
        })
        return result;
    }

    private convertData(toPrint: Data, level: number, parser: DataParser): string {
        const tabs = '\t'.repeat(level)
        let result = tabs + 'Tag:\t' + determineNamespaceName(toPrint.tag) + '.' + determineTagName(toPrint.tag) + ' - ' + toPrint.tag + '\n'
        result += tabs + 'Type:\t' + determineDataTypeName(toPrint.type) + ' - ' + toPrint.type + '\n'
        if (toPrint.type === DataType.CONTAINER) {
            toPrint.valueAsContainer(parser).forEach(d => {
                result += this.convertData(d, level + 1, parser)
            })
        }
        else {
            result += tabs + 'Value:\t' + toPrint.valueAsString() + ' - ' + toPrint.valueAsHex + '\n\n'
        }
        return result
    }

}
