import {LiveDataService} from '../api/service/live-data-service';
import {PowerState} from '../api/service/model/power-state';
import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {RequestLiveDataCreator} from './creator/request-live-data-creator';
import {FrameConverter, RequestResponseFrameConverter} from './converter/frame-converter';
import {PowerStateConverter} from './converter/power-state-converter';
import {DBSummaryService} from '../api/service/db-summary-service';
import {HistoryData} from '../api/service/model/history-data';
import {DailySummaryConverter} from './converter/db/daily-summary-converter';
import {ReadDailySummaryCreator} from './creator/db/read-daily-summary-creator';
import {ReadMonthlySummaryCreator} from './creator/db/read-monthly-summary-creator';
import {MonthlySummaryConverter} from './converter/db/monthly-summary-converter';
import {ReadYearlySummaryCreator} from './creator/db/read-yearly-summary-creator';
import {YearlySummaryConverter} from './converter/db/yearly-summary-converter';

export class DefaultDbSummaryService implements DBSummaryService {

    constructor(
        private connection: HomePowerPlantConnection,
        private dailyRequestCreator: FrameCreator<Date> = new ReadDailySummaryCreator(),
        private dailyResponseConverter: RequestResponseFrameConverter<HistoryData> = new DailySummaryConverter(),
        private monthlyRequestCreator: FrameCreator<Date> = new ReadMonthlySummaryCreator(),
        private monthlyResponseConverter: RequestResponseFrameConverter<HistoryData> = new MonthlySummaryConverter(),
        private yearlyRequestCreator: FrameCreator<Date> = new ReadYearlySummaryCreator(),
        private yearlyResponseConverter: RequestResponseFrameConverter<HistoryData> = new YearlySummaryConverter()
    ) {
    }

    readDailySummary(day: Date): Promise<HistoryData> {
        return new Promise<HistoryData>((resolve, reject) => {
            const request = this.dailyRequestCreator.create(day)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.dailyResponseConverter.convert(request, response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

    readMonthlySummary(month: number, year: number): Promise<HistoryData> {
        return new Promise<HistoryData>((resolve, reject) => {
            const asDate = new Date()
            asDate.setFullYear(year, month, 1)
            const request = this.monthlyRequestCreator.create(asDate)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.monthlyResponseConverter.convert(request, response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

    readYearlySummary(year: number): Promise<HistoryData> {
        return new Promise<HistoryData>((resolve, reject) => {
            const asDate = new Date()
            asDate.setFullYear(year, 1, 1)
            const request = this.yearlyRequestCreator.create(asDate)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.yearlyResponseConverter.convert(request, response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

}
