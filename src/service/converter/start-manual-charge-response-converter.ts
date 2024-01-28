import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class StartManualChargeResponseConverter implements FrameConverter<boolean> {
    convert(frame: Frame): boolean {
        return frame.booleanByTag(EMSTag.START_MANUAL_CHARGE);
    }
}
