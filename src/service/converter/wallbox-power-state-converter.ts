import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {WallboxPowerState} from '../../api/service/model/wallbox-power-state';
import {WBTag} from '../../api/frame/tags/WBTag';
import {DataParser} from '../../api/frame/data-parser';
import {DefaultDataParser} from '../../lowlevel/frame/default-data-parser';
import {WbExternalDataParser} from '../../api/frame/wb-external-data-parser';
import {DefaultWbExternalDataParser} from '../../lowlevel/frame/default-wb-external-data-parser';

export class WallboxPowerStateConverter implements FrameConverter<WallboxPowerState[]> {

    constructor(private parser: DataParser = new DefaultDataParser(),
                private externalDataParser: WbExternalDataParser = new DefaultWbExternalDataParser(parser)) {
    }
    convert(frame: Frame): WallboxPowerState[] {
        const result: WallboxPowerState[] = []
        frame.data
            .filter(value => value.tag == WBTag.DATA)
            .map(value => {
                const childs = value.valueAsContainer(this.parser)
                const index = childs.find(child => child.tag == WBTag.INDEX)?.valueAsNumber()
                const sunRAW = childs.find(child => child.tag == WBTag.EXTERN_DATA_SUN)
                const allRAW = childs.find(child => child.tag == WBTag.EXTERN_DATA_ALL)
                if (index != undefined && sunRAW != undefined && allRAW != undefined) {
                    try {
                        const sun = this.externalDataParser.parseEnergyData(sunRAW)
                        const all = this.externalDataParser.parseEnergyData(allRAW)
                        const result: WallboxPowerState = {
                            id: index,
                            powerW: all.powerW,
                            solarPowerW: sun.powerW
                        }
                        return result
                    } catch (e) {
                        // ignore not parsable data
                    }

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
