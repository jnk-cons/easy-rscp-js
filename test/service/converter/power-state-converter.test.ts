import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
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
                new DataBuilder().tag(EMSTag.POWER_WB_ALL).int32(1370).build(),
                new DataBuilder().tag(EMSTag.POWER_WB_SOLAR).int32(531).build(),
            ).build()

        const toTest = new PowerStateConverter()
        const result = toTest.convert(frame)

        expect(result.pvDelivery).toBe(2000)
        expect(result.gridDelivery).toBe(300)
        expect(result.batteryDelivery).toBe(-450)
        expect(result.houseConsumption).toBe(370)
        expect(result.batteryChargingLevel).toBe(0.82)
        expect(result.wallboxConsumption).toBe(1370)
        expect(result.wallboxProportionateSolarShare).toBe(531)
    })

})

