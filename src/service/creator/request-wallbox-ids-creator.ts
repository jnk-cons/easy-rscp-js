import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {WBTag} from '../../api/frame/tags/WBTag';

export class RequestWallboxIdsCreator implements FrameCreator<undefined> {
    create(input: undefined): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(WBTag.REQ_CONNECTED_DEVICES).build(),
            )
            .build();
    }

}
