import {FrameConverter} from './frame-converter';
import {ChargingConfiguration, ChargingLimits} from '../../api/service/model/charging-configuration';
import {Frame} from '../../api/frame/frame';
import {EMSTag} from '../../api/frame/tags/EMSTag';
import {SysSpecData} from '../../api/frame/sys-spec-data';
import {EMSSysSpecName} from '../../api/frame/EMSSysSpecName';
import {EmergencyPowerState} from '../../api/service/model/emergency-power-state';
import {EPTag} from '../../api/frame/tags/EPTag';

export class EmergencyPowerStateConverter implements FrameConverter<EmergencyPowerState> {
    convert(frame: Frame): EmergencyPowerState {
        return {
            reserveWh: frame.numberByTag(EPTag.PARAM_EP_RESERVE_ENERGY, EPTag.EP_RESERVE),
            reservePercentage: frame.numberByTag(EPTag.PARAM_EP_RESERVE, EPTag.EP_RESERVE) / 100.0,
            connectedToGrid: frame.booleanByTag(EPTag.IS_GRID_CONNECTED),
            readyForSwitch: frame.booleanByTag(EPTag.IS_READY_FOR_SWITCH),
            emergencyPowerPossible: frame.booleanByTag(EPTag.IS_POSSIBLE),
            island: frame.booleanByTag(EPTag.IS_INVALID_STATE),
            invalidState: frame.booleanByTag(EPTag.IS_ISLAND_GRID)
        }
    }
}
