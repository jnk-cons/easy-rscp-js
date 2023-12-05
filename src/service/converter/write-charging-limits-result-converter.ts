import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {ProductionDate, SystemInfo} from '../../api/service/model/system-info';
import {InfoTag} from '../../api/frame/tags/InfoTag';
import {WriteChargingLimitsResult} from '../../api/service/model/charging-configuration';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class WriteChargingLimitsResultConverter implements FrameConverter<WriteChargingLimitsResult> {
    convert(frame: Frame): WriteChargingLimitsResult {
        return {
            maxCurrentChargingPower: frame.resultCodeByTag(EMSTag.RES_MAX_CHARGE_POWER, EMSTag.SET_POWER_SETTINGS),
            maxCurrentDischargingPower: frame.resultCodeByTag(EMSTag.RES_MAX_DISCHARGE_POWER, EMSTag.SET_POWER_SETTINGS),
            dischargeStartPower: frame.resultCodeByTag(EMSTag.DISCHARGE_START_POWER, EMSTag.SET_POWER_SETTINGS),
            chargingLimitationsEnabled: frame.resultCodeByTag(EMSTag.RES_POWER_LIMITS_USED, EMSTag.SET_POWER_SETTINGS),
        }
    }
}
