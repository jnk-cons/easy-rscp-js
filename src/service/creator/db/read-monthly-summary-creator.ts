import {FrameCreator} from '../frame-creator';
import {Frame} from '../../../api/frame/frame';
import {FrameBuilder} from '../../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../lowlevel/frame/data-builder';
import {DBTag} from '../../../api/frame/tags/DBTag';
import {Duration} from '../../../api/frame/duration';

export class ReadMonthlySummaryCreator implements FrameCreator<Date> {

    private getDaysInMonth(date: Date): number {
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return lastDayOfMonth.getDate();
    }

    create(input: Date): Frame {
        input.setMonth(input.getMonth(), 1);  // Erster Tag des Monats
        input.setHours(0, 0, 0, 0);
        const daysOfMonth= this.getDaysInMonth(input);
        const duration: Duration = {
            seconds: daysOfMonth * 24 * 60 * 60,
            nanos: 0
        }
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(DBTag.REQ_HISTORY_DATA_MONTH).container(
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_START).timestamp(input).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_INTERVAL).duration(duration).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_SPAN).duration(duration).build()
                )
                .build()
            )
            .build();
    }

}
