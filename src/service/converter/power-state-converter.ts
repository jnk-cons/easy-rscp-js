import {FrameConverter} from './frame-converter';
import {ChargingConfiguration, ChargingLimits} from '../../api/service/model/charging-configuration';
import {Frame} from '../../api/frame/frame';
import {EMSTag} from '../../api/frame/tags/EMSTag';
import {SysSpecData} from '../../api/frame/sys-spec-data';
import {EMSSysSpecName} from '../../api/frame/EMSSysSpecName';
import {PowerState} from '../../api/service/model/power-state';

export class PowerStateConverter implements FrameConverter<PowerState> {
    convert(frame: Frame): PowerState {
        return {
            timestamp: frame.timestamp,
            pvDelivery: frame.numberByTag(EMSTag.POWER_PV),
            gridDelivery: frame.numberByTag(EMSTag.POWER_GRID),
            batteryDelivery: frame.numberByTag(EMSTag.POWER_BAT) * -1,
            houseConsumption: frame.numberByTag(EMSTag.POWER_HOME),
            batteryChargingLevel: frame.numberByTag(EMSTag.BAT_SOC) / 100.0,
            wallboxConsumption: frame.numberByTag(EMSTag.POWER_WB_ALL),
            wallboxProportionateSolarShare: frame.numberByTag(EMSTag.POWER_WB_SOLAR),
        }
    }

}
