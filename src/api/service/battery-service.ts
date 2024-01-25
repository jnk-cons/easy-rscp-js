import {BatterySpec, BatteryStatus} from './model/battery';

export interface BatteryService {
    readSpecification(): Promise<BatterySpec[]>

    readMonitoringData(): Promise<BatteryStatus[]>
}
