import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EMSTag} from '../../api/frame/tags/EMSTag';
import {EPTag} from '../../api/frame/tags/EPTag';

export class ReadEmergencyPowerStateCreator implements FrameCreator<undefined> {
    create(input: undefined): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(EPTag.REQ_EP_RESERVE).build(),
                new DataBuilder().tag(EPTag.REQ_IS_POSSIBLE).build(),
                new DataBuilder().tag(EPTag.REQ_IS_GRID_CONNECTED).build(),
                new DataBuilder().tag(EPTag.REQ_IS_ISLAND_GRID).build(),
                new DataBuilder().tag(EPTag.REQ_IS_INVALID_STATE).build(),
                new DataBuilder().tag(EPTag.REQ_IS_READY_FOR_SWITCH).build(),
            )
            .build();
    }

}
