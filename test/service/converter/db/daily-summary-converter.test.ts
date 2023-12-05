import {FrameBuilder} from '../../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../../src/lowlevel/frame/data-builder';
import {DBTag} from '../../../../src/api/frame/tags/DBTag';
import {Duration} from '../../../../src/api/frame/duration';
import {DailySummaryConverter} from '../../../../src/service/converter/db/daily-summary-converter';


describe('daily summary converter tests ', function() {
    it('test conversion', function () {
        const day = new Date(2023, 6, 27, 0, 0,0,0,)

        const _24HoursDuration: Duration = {
            seconds: 24 * 60 * 60,
            nanos: 0
        }

        const requestFrame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(DBTag.REQ_HISTORY_DATA_DAY).container(
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_START).timestamp(day).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_INTERVAL).duration(_24HoursDuration).build(),
                    new DataBuilder().tag(DBTag.REQ_HISTORY_TIME_SPAN).duration(_24HoursDuration).build()
                )
                    .build()
            )
            .build()
        const responseFrame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(DBTag.HISTORY_DATA_DAY).container(
                    new DataBuilder().tag(DBTag.SUM_CONTAINER).container(
                        new DataBuilder().tag(DBTag.BAT_POWER_IN).float32(1000.0).build(),
                        new DataBuilder().tag(DBTag.BAT_POWER_OUT).float32(2000.0).build(),
                        new DataBuilder().tag(DBTag.GRID_POWER_IN).float32(3000.0).build(),
                        new DataBuilder().tag(DBTag.GRID_POWER_OUT).float32(4000.0).build(),
                        new DataBuilder().tag(DBTag.DC_POWER).float32(5000.0).build(),
                        new DataBuilder().tag(DBTag.CONSUMPTION).float32(6000.0).build(),
                        new DataBuilder().tag(DBTag.AUTARKY).float32(85.3).build(),
                        new DataBuilder().tag(DBTag.CONSUMED_PRODUCTION).float32(75.3).build(),
                    ).build(),
                    new DataBuilder().tag(DBTag.VALUE_CONTAINER).container(
                        new DataBuilder().tag(DBTag.BAT_POWER_IN).float32(100.0).build(),
                        new DataBuilder().tag(DBTag.BAT_POWER_OUT).float32(200.0).build(),
                        new DataBuilder().tag(DBTag.GRID_POWER_IN).float32(300.0).build(),
                        new DataBuilder().tag(DBTag.GRID_POWER_OUT).float32(400.0).build(),
                        new DataBuilder().tag(DBTag.DC_POWER).float32(500.0).build(),
                        new DataBuilder().tag(DBTag.CONSUMPTION).float32(600.0).build(),
                        new DataBuilder().tag(DBTag.AUTARKY).float32(15.3).build(),
                        new DataBuilder().tag(DBTag.CONSUMED_PRODUCTION).float32(25.3).build(),
                    ).build()
                ).build()
            ).build()

        const toTest = new DailySummaryConverter()
        const result = toTest.convert(requestFrame, responseFrame)

        expect(result.batteryIn).toBe(1000.0)
        expect(result.batteryOut).toBe(2000.0)
        expect(result.gridIn).toBe(3000.0)
        expect(result.gridOut).toBe(4000.0)
        expect(result.pvDelivery).toBe(5000.0)
        expect(result.houseConsumption).toBe(6000.0)
        expect(result.selfSufficiency >= 0.8529 && result.selfSufficiency <= 0.854).toBeTrue()
        expect(result.selfConsumption >= 0.7529 && result.selfConsumption <= 0.754).toBeTrue()
    })

})

