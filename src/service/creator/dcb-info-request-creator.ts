import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EMSTag} from '../../api/frame/tags/EMSTag';
import {BatTag} from '../../api/frame/tags/BatTag';

export class DcbInfoRequestCreator implements FrameCreator<DCBIdent> {
    create(ident: DCBIdent): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(BatTag.REQ_DATA).container(
                    new DataBuilder().tag(BatTag.INDEX).uint16(ident.batIndex).build(),
                    new DataBuilder().tag(BatTag.REQ_DCB_INFO).uint16(ident.dcbIndex).build(),
                    new DataBuilder().tag(BatTag.REQ_DCB_ALL_CELL_TEMPERATURES).build(),
                    new DataBuilder().tag(BatTag.REQ_DCB_ALL_CELL_VOLTAGES).build(),
                ).build(),
            )
            .build();
    }
}

export interface DCBIdent {
    batIndex: number,
    dcbIndex: number
}
