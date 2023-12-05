import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {InfoTag} from '../../api/frame/tags/InfoTag';
import {ChargingLimits} from '../../api/service/model/charging-configuration';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class SetPowerSettingsCreator implements FrameCreator<ChargingLimits> {
    create(input: ChargingLimits): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.REQ_SET_POWER_SETTINGS).container(
                    new DataBuilder().tag(EMSTag.MAX_CHARGE_POWER).uint32(input.maxCurrentChargingPower).build(),
                    new DataBuilder().tag(EMSTag.MAX_DISCHARGE_POWER).uint32(input.maxCurrentDischargingPower).build(),
                    new DataBuilder().tag(EMSTag.DISCHARGE_START_POWER).uint32(input.dischargeStartPower).build(),
                    new DataBuilder().tag(EMSTag.POWER_LIMITS_USED).boolean(input.chargingLimitationsEnabled).build(),
                ).build()
            )
            .build();
    }

}
