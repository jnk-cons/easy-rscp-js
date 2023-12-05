import {Duration} from '../../frame/duration';

export interface HistoryData {
    start: Date
    duration: Duration
    batteryIn: number
    batteryOut: number
    gridIn: number
    gridOut: number
    pvDelivery: number
    houseConsumption: number
    selfSufficiency: number
    selfConsumption: number
}
