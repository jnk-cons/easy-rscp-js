import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EMSTag} from '../../api/frame/tags/EMSTag';
import {BatTag} from '../../api/frame/tags/BatTag';

export class BatteryInfoRequestCreator implements FrameCreator<number> {
    create(batIndex: number): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(BatTag.REQ_DATA).container(
                    new DataBuilder().tag(BatTag.INDEX).uint16(batIndex).build(),
                    new DataBuilder().tag(BatTag.REQ_DEVICE_NAME).build(),
                    new DataBuilder().tag(BatTag.REQ_CHARGE_HIGH_TEMP).build(),
                    new DataBuilder().tag(BatTag.REQ_CHARGE_LOW_TEMP).build(),
                    new DataBuilder().tag(BatTag.REQ_DESIGN_VOLTAGE).build(),
                    new DataBuilder().tag(BatTag.REQ_DESIGN_CAPACITY).build(),
                    new DataBuilder().tag(BatTag.REQ_SPECIFICATION).build(),
                    new DataBuilder().tag(BatTag.REQ_MAX_CHARGE_CURRENT).build(),
                    new DataBuilder().tag(BatTag.REQ_MAX_DISCHARGE_CURRENT).build(),
                    new DataBuilder().tag(BatTag.REQ_DCB_COUNT).build(),
                    new DataBuilder().tag(BatTag.REQ_TRAINING_MODE).build(),
                    new DataBuilder().tag(BatTag.REQ_DEVICE_STATE).build(),
                    new DataBuilder().tag(BatTag.REQ_ASOC).build(),
                    new DataBuilder().tag(BatTag.REQ_RSOC_REAL).build(),
                    new DataBuilder().tag(BatTag.REQ_MODULE_VOLTAGE).build(),
                ).build(),
            )
            .build();
    }

}
