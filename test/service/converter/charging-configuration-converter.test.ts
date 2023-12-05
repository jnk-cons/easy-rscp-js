import {DataType} from '../../../src/api/frame/DataType';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {EMSSysSpecName} from '../../../src/api/frame/EMSSysSpecName';
import {ChargingConfigurationConverter} from '../../../src/service/converter/charging-configuration-converter';
import {StringFrameConverter} from '../../../src/service/converter/string-frame-converter';

describe('charging configuration converter tests ', function() {
    it('test conversion', function () {
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.GET_POWER_SETTINGS).container(
                    new DataBuilder().tag(EMSTag.MAX_CHARGE_POWER).int32(7000).build(),
                    new DataBuilder().tag(EMSTag.MAX_DISCHARGE_POWER).int32(6000).build(),
                    new DataBuilder().tag(EMSTag.DISCHARGE_START_POWER).int32(65).build(),
                    new DataBuilder().tag(EMSTag.POWER_LIMITS_USED).boolean(true).build(),
                ).build(),
                new DataBuilder().tag(EMSTag.GET_SYS_SPECS).container(
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(0).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.MAX_CHARGE_POWER).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(10000).build(),
                    ).build(),
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(1).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.MAX_BATTERY_CHARGE_POWER).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(11000).build(),
                    ).build(),
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(2).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.MAX_DISCHARGE_POWER).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(12000).build(),
                    ).build(),
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(3).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.MAX_BATTERY_DISCHARGE_POWER).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(13000).build(),
                    ).build(),
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(4).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.MIN_START_CHARGE_POWER).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(10).build(),
                    ).build(),
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(5).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.MIN_START_DISCHARGE_POWER).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(20).build(),
                    ).build(),
                    new DataBuilder().tag(EMSTag.SYS_SPEC).container(
                        new DataBuilder().tag(EMSTag.SYS_SPEC_INDEX).int32(6).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_NAME).string(EMSSysSpecName.START_CHARGE_DEFAULT).build(),
                        new DataBuilder().tag(EMSTag.SYS_SPEC_VALUE_INT).int32(30).build(),
                    ).build()
                ).build()
            ).build()

        const toTest = new ChargingConfigurationConverter()
        const result = toTest.convert(frame)

        expect(result.currentLimitations.maxCurrentChargingPower).toBe(7000)
        expect(result.currentLimitations.maxCurrentDischargingPower).toBe(6000)
        expect(result.currentLimitations.dischargeStartPower).toBe(65)
        expect(result.currentLimitations.chargingLimitationsEnabled).toBeTrue()

        expect(result.maxPossibleChargingPower).toBe(10000)
        expect(result.minPossibleChargingPower).toBe(10)
        expect(result.maxPossibleDischargingPower).toBe(12000)
        expect(result.minPossibleDischargingPower).toBe(20)
        expect(result.defaultStartChargingThreshold).toBe(30)

    })

})

