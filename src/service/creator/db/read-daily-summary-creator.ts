import {FrameCreator} from '../frame-creator';
import {Frame} from '../../../api/frame/frame';
import {FrameBuilder} from '../../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../lowlevel/frame/data-builder';
import {DBTag} from '../../../api/frame/tags/DBTag';

const _24_HOURS_SECONDS = 24 * 60 * 60

export class ReadDailySummaryCreator implements FrameCreator<Date> {
    create(input: Date): Frame {

        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(DBTag.REQ_HISTORY_DATA_DAY).container(
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_START).timestamp(new Date(input.setHours(0, 0, 0, 0))).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_INTERVAL).duration({
                        seconds: _24_HOURS_SECONDS,
                        nanos: 0
                    }).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_SPAN).duration({
                        seconds: _24_HOURS_SECONDS,
                        nanos: 0
                    }).build()
                )
                .build()
            )
            .build();
    }

}
