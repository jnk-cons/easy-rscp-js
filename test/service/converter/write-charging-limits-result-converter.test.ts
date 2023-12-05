import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {ResultCode} from '../../../src/api/service/model/result-code';
import {
    WriteChargingLimitsResultConverter
} from '../../../src/service/converter/write-charging-limits-result-converter';

describe('write charging limits result converter tests ', function() {
    it('test conversion', function () {
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.SET_POWER_SETTINGS).container(
                    new DataBuilder().tag(EMSTag.RES_MAX_CHARGE_POWER).int32(ResultCode.SUCCESS).build(),
                    new DataBuilder().tag(EMSTag.RES_MAX_DISCHARGE_POWER).int32(ResultCode.UNHANDLED).build(),
                    new DataBuilder().tag(EMSTag.DISCHARGE_START_POWER).int32(ResultCode.ACCESS_DENIED).build(),
                    new DataBuilder().tag(EMSTag.RES_POWER_LIMITS_USED).int32(ResultCode.FORMAT_ERROR).build(),
                ).build()
            ).build()

        const toTest = new WriteChargingLimitsResultConverter()
        const result = toTest.convert(frame)

        expect(result.maxCurrentChargingPower).toBe(ResultCode.SUCCESS)
        expect(result.maxCurrentDischargingPower).toBe(ResultCode.UNHANDLED)
        expect(result.dischargeStartPower).toBe(ResultCode.ACCESS_DENIED)
        expect(result.chargingLimitationsEnabled).toBe(ResultCode.FORMAT_ERROR)
    })

})

