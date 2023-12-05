import {Data} from './data';
import {DataParser} from './data-parser';
import {DefaultDataParser} from '../../lowlevel/frame/default-data-parser';
import {EMSTag} from './tags/EMSTag';
import {EMSSysSpecName} from './EMSSysSpecName';

export class SysSpecData {
    private specEntries: Data[]
    constructor(public rawData: Data, public parser: DataParser = new DefaultDataParser()) {
        if (rawData.tag != EMSTag.GET_SYS_SPECS) {
            throw Error('Given data is not of tag EMS.GET_SYS_SPECS (' + EMSTag.REQ_GET_SYS_SPECS + ')')
        }
        this.specEntries = this.rawData.valueAsContainer(this.parser)
    }

    stringValue(spec: EMSSysSpecName): string | undefined {
        return this.stringValueBySpecName(spec)
    }

    stringValueBySpecName(specName: string): string | undefined {
        return this.dataBySpecName(specName, true)?.valueAsString()
    }

    intValue(spec: EMSSysSpecName): number | undefined {
        return this.intValueBySpecName(spec)
    }

    intValueBySpecName(specName: string): number | undefined {
        return this.dataBySpecName(specName, false)?.valueAsNumber()
    }

    private dataBySpecName(specName: string, asString: boolean): Data | undefined {
        for (const specContainer of this.specEntries) {
            if (specContainer.tag == EMSTag.SYS_SPEC) {
                let valueData : Data | undefined = undefined
                let found = false
                const children = specContainer.valueAsContainer(this.parser)
                for (const currentChild of children) {
                    if (asString && currentChild.tag == EMSTag.SYS_SPEC_VALUE_STRING) {
                        valueData = currentChild
                    }
                    else if (!asString && currentChild.tag == EMSTag.SYS_SPEC_VALUE_INT) {
                        valueData = currentChild
                    }
                    if (currentChild.tag == EMSTag.SYS_SPEC_NAME && specName == currentChild.valueAsString()) {
                        found = true
                    }
                }
                if (found) {
                    return valueData
                }
            }
        }
        return undefined
    }

}
