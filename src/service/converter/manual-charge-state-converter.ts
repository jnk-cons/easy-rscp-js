import {FrameConverter} from './frame-converter';
import {ManualChargeState} from '../../api/service/model/manual-charge';
import {Frame} from '../../api/frame/frame';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class ManualChargeStateConverter implements FrameConverter<ManualChargeState> {
    convert(frame: Frame): ManualChargeState {
        return {
            active: frame.booleanByTag(EMSTag.MANUAL_CHARGE_ACTIVE, EMSTag.GET_MANUAL_CHARGE),
            chargedEnergyWh: frame.numberByTag(EMSTag.MANUAL_CHARGE_ENERGY_COUNTER, EMSTag.GET_MANUAL_CHARGE),
            lastRun: frame.timestampByTag(EMSTag.MANUAL_CHARGE_LASTSTART, EMSTag.GET_MANUAL_CHARGE),
        };
    }
}
