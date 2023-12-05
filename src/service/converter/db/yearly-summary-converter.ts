import {FrameConverter, RequestResponseFrameConverter} from '../frame-converter';
import {HistoryData} from '../../../api/service/model/history-data';
import {Frame} from '../../../api/frame/frame';
import {DBTag} from '../../../api/frame/tags/DBTag';


export class YearlySummaryConverter implements RequestResponseFrameConverter<HistoryData> {
    convert(request: Frame, response: Frame): HistoryData {
        return {
            start: request.timestampByTag(DBTag.REQ_HISTORY_TIME_START, DBTag.REQ_HISTORY_DATA_YEAR),
            duration: request.durationByTag(DBTag.REQ_HISTORY_TIME_SPAN, DBTag.HISTORY_DATA_YEAR),
            batteryIn: response.numberByTag(DBTag.BAT_POWER_IN, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER),
            batteryOut: response.numberByTag(DBTag.BAT_POWER_OUT, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER),
            gridIn: response.numberByTag(DBTag.GRID_POWER_IN, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER),
            gridOut: response.numberByTag(DBTag.GRID_POWER_OUT, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER),
            pvDelivery: response.numberByTag(DBTag.DC_POWER, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER),
            houseConsumption: response.numberByTag(DBTag.CONSUMPTION, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER),
            selfSufficiency: response.numberByTag(DBTag.AUTARKY, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER) / 100.0,
            selfConsumption: response.numberByTag(DBTag.CONSUMED_PRODUCTION, DBTag.HISTORY_DATA_YEAR, DBTag.SUM_CONTAINER) / 100.0
        }
    }

}
