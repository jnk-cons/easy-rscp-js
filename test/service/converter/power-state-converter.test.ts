import {DataType} from '../../../src/api/frame/DataType';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {EMSSysSpecName} from '../../../src/api/frame/EMSSysSpecName';
import {ChargingConfigurationConverter} from '../../../src/service/converter/charging-configuration-converter';
import {StringFrameConverter} from '../../../src/service/converter/string-frame-converter';
import {PowerStateConverter} from '../../../src/service/converter/power-state-converter';

describe('power state converter tests ', function() {
    it('test conversion', function () {
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.POWER_PV).int32(2000).build(),
                new DataBuilder().tag(EMSTag.POWER_GRID).int32(300).build(),
                new DataBuilder().tag(EMSTag.POWER_BAT).int32(450).build(),
                new DataBuilder().tag(EMSTag.POWER_HOME).int32(370).build(),
                new DataBuilder().tag(EMSTag.BAT_SOC).uchar8(82).build(),
            ).build()

        const toTest = new PowerStateConverter()
        const result = toTest.convert(frame)

        expect(result.pvDelivery).toBe(2000)
        expect(result.gridDelivery).toBe(300)
        expect(result.batteryDelivery).toBe(-450)
        expect(result.houseConsumption).toBe(370)
        expect(result.batteryChargingLevel).toBe(0.82)
    })

})

