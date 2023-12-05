import {FrameCreator} from '../frame-creator';
import {Frame} from '../../../api/frame/frame';
import {FrameBuilder} from '../../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../lowlevel/frame/data-builder';
import {DBTag} from '../../../api/frame/tags/DBTag';
import {Duration} from '../../../api/frame/duration';

export class ReadYearlySummaryCreator implements FrameCreator<Date> {

    private getDaysInYear(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const lastDayOfYear = new Date(date.getFullYear() + 1, 0, 0);
        const millisecondsInDay = 24 * 60 * 60 * 1000;

        return Math.round((lastDayOfYear.getTime() - firstDayOfYear.getTime()) / millisecondsInDay);
    }

    create(input: Date): Frame {
        let startOfYear = new Date(input.getFullYear(), 0, 1, 0, 0, 0, 0);
        const daysOfMonth= this.getDaysInYear(input);
        const duration: Duration = {
            seconds: daysOfMonth * 24 * 60 * 60,
            nanos: 0
        }
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(DBTag.REQ_HISTORY_DATA_YEAR).container(
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_START).timestamp(startOfYear).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_INTERVAL).duration(duration).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_SPAN).duration(duration).build()
                )
                .build()
            )
            .build();
    }

}
