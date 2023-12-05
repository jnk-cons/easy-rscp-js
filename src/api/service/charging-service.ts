import {ChargingConfiguration, ChargingLimits, WriteChargingLimitsResult} from './model/charging-configuration';

export interface ChargingService {
    readConfiguration(): Promise<ChargingConfiguration>

    writeLimits(limits: ChargingLimits): Promise<WriteChargingLimitsResult>
}
