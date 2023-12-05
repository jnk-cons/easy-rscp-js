import {HistoryData} from './model/history-data';

export interface DBSummaryService {
    readDailySummary(day: Date): Promise<HistoryData>
    readMonthlySummary(month: number, year: number): Promise<HistoryData>
    readYearlySummary(year: number): Promise<HistoryData>
}
