import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {Data} from '../../api/frame/data';
import {DataParser} from '../../api/frame/data-parser';
import {DataType} from '../../api/frame/DataType';
import {determineDataTypeName, determineNamespaceName, determineTagName} from '../../api/helper/type-helper';
import {RSCPTag} from '../../api/frame/tags/RSCPTag';

export class StringFrameConverter implements FrameConverter<string> {

    private TAGS_TO_OMIT = [RSCPTag.AUTHENTICATION_USER, RSCPTag.AUTHENTICATION_PASSWORD, RSCPTag.SET_ENCRYPTION_PASSPHRASE]

    constructor(private omitAuthenticationData: boolean = true) {
    }

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
            result += tabs + 'Value:\t'
            if (this.shouldMaks(toPrint)) {
                result += '*** - ***\n\n'
            }
            else {
                result += toPrint.valueAsString() + ' - ' + toPrint.valueAsHex + '\n\n'
            }
        }
        return result
    }

    private shouldMaks(toPrint: Data): boolean {
        return this.omitAuthenticationData && this.TAGS_TO_OMIT.find(value => value == toPrint.tag) != undefined
    }

}
