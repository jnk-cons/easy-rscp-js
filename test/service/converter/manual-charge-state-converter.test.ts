import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {EMSTag} from '../../../src';
import {ManualChargeStateConverter} from '../../../src/service/converter/manual-charge-state-converter';

describe('manual charge state converter tests ', function() {
    it('test conversion', function () {
        const timestamp = new Date()
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.GET_MANUAL_CHARGE).container(
                    new DataBuilder().tag(EMSTag.MANUAL_CHARGE_ACTIVE).boolean(true).build(),
                    new DataBuilder().tag(EMSTag.MANUAL_CHARGE_LASTSTART).timestamp(timestamp).build(),
                    new DataBuilder().tag(EMSTag.MANUAL_CHARGE_START_COUNTER).int32(100).build(),
                    new DataBuilder().tag(EMSTag.MANUAL_CHARGE_ENERGY_COUNTER).double64(3000.0).build()
                ).build()
            ).build()

        const toTest = new ManualChargeStateConverter()
        const result = toTest.convert(frame)

        expect(result.active).toBe(true)
        expect(result.lastRun).toBe(timestamp)
        expect(result.chargedEnergyWh).toBe(3000.0)
    })

})

