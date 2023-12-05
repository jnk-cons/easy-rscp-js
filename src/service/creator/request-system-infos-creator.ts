import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {InfoTag} from '../../api/frame/tags/InfoTag';

export class RequestSystemInfosCreator implements FrameCreator<undefined> {
    create(input: undefined): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(InfoTag.REQ_MAC_ADDRESS).build(),
                new DataBuilder().tag(InfoTag.REQ_PRODUCTION_DATE).build(),
                new DataBuilder().tag(InfoTag.REQ_SERIAL_NUMBER).build(),
                new DataBuilder().tag(InfoTag.REQ_SW_RELEASE).build()
            )
            .build();
    }

}
