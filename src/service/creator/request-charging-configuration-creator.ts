import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EMSTag} from '../../api/frame/tags/EMSTag';

export class RequestChargingConfigurationCreator implements FrameCreator<undefined> {
    create(input: undefined): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.REQ_GET_POWER_SETTINGS).build(),
                new DataBuilder().tag(EMSTag.REQ_GET_SYS_SPECS).build()
            )
            .build();
    }

}
