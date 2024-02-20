import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {WallboxInfo} from '../../api/service/model/wallbox-info';
import {WBTag} from '../../api/frame/tags/WBTag';
import {DataParser} from '../../api/frame/data-parser';
import {DefaultDataParser} from '../../lowlevel/frame/default-data-parser';

export class WallboxDeviceInfosConverter implements FrameConverter<WallboxInfo[]> {

    constructor(private parser: DataParser = new DefaultDataParser()) {
    }

    convert(frame: Frame): WallboxInfo[] {
        const result: WallboxInfo[] = []
        frame.data
            .filter(value => value.tag == WBTag.DATA)
            .map(value => {
                const childs = value.valueAsContainer(this.parser)
                const index = childs.find(child => child.tag == WBTag.INDEX)?.valueAsNumber()
                const name = childs.find(child => child.tag == WBTag.DEVICE_NAME)?.valueAsString()
                if (index != undefined && name != undefined) {
                    const result: WallboxInfo = {
                        id: index,
                        name: name
                    }
                    return result
                }
                return null
            })
            .forEach(value => {
                if (value != null) {
                    result.push(value)
                }
            })
        return result
    }

}
