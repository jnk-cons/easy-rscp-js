import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class RequestStartManualChargeCreator implements FrameCreator<number> {
    create(amountWh: number): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.REQ_START_MANUAL_CHARGE).uint32(amountWh).build()
            )
            .build();
    }
}
