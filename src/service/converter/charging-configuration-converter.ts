import {FrameConverter} from './frame-converter';
import {ChargingConfiguration, ChargingLimits} from '../../api/service/model/charging-configuration';
import {Frame} from '../../api/frame/frame';
import {EMSTag} from '../../api/frame/tags/EMSTag';
import {SysSpecData} from '../../api/frame/sys-spec-data';
import {EMSSysSpecName} from '../../api/frame/EMSSysSpecName';

export class ChargingConfigurationConverter implements FrameConverter<ChargingConfiguration> {
    convert(frame: Frame): ChargingConfiguration {
        const limits: ChargingLimits = {
            maxCurrentChargingPower: frame.numberByTag(EMSTag.MAX_CHARGE_POWER, EMSTag.GET_POWER_SETTINGS),
            maxCurrentDischargingPower: frame.numberByTag(EMSTag.MAX_DISCHARGE_POWER, EMSTag.GET_POWER_SETTINGS),
            dischargeStartPower: frame.numberByTag(EMSTag.DISCHARGE_START_POWER, EMSTag.GET_POWER_SETTINGS),
            chargingLimitationsEnabled: frame.booleanByTag(EMSTag.POWER_LIMITS_USED, EMSTag.GET_POWER_SETTINGS)
        }

        const sysSpecData = frame.dataByTag(EMSTag.GET_SYS_SPECS)
        if (sysSpecData) {
            const spec = new SysSpecData(sysSpecData, frame.parser)
            return {
                currentLimitations: limits,
                maxPossibleChargingPower: this.nullSafeMin(spec.intValue(EMSSysSpecName.MAX_CHARGE_POWER), spec.intValue(EMSSysSpecName.MAX_BATTERY_CHARGE_POWER)),
                maxPossibleDischargingPower: this.nullSafeMin(spec.intValue(EMSSysSpecName.MAX_DISCHARGE_POWER), spec.intValue(EMSSysSpecName.MAX_BATTERY_DISCHARGE_POWER)),
                minPossibleChargingPower: spec.intValue(EMSSysSpecName.MIN_START_CHARGE_POWER) ?? 0,
                minPossibleDischargingPower: spec.intValue(EMSSysSpecName.MIN_START_DISCHARGE_POWER) ?? 0,
                defaultStartChargingThreshold: spec.intValue(EMSSysSpecName.START_CHARGE_DEFAULT) ?? 0
            }
        }
        else {
            throw new Error('Frame does not contain a EMS.GET_SYS_SPECS (' + EMSTag.REQ_GET_SYS_SPECS + ') data block')
        }
    }

    private nullSafeMin(a: number | undefined, b: number | undefined): number {
        if (a == undefined) {
            return b ?? 0
        }
        if (b == undefined) {
            return a ?? 0
        }
        return Math.min(a, b)
    }

}
