import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class RequestLiveDataCreator implements FrameCreator<undefined> {
    create(input: undefined): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.REQ_POWER_PV).build(),
                new DataBuilder().tag(EMSTag.REQ_POWER_BAT).build(),
                new DataBuilder().tag(EMSTag.REQ_POWER_GRID).build(),
                new DataBuilder().tag(EMSTag.REQ_POWER_HOME).build(),
                new DataBuilder().tag(EMSTag.REQ_BAT_SOC).build(),
            )
            .build();
    }

}
