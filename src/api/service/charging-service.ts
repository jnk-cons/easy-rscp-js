import {ChargingConfiguration, ChargingLimits, WriteChargingLimitsResult} from './model/charging-configuration';
import {ManualChargeState} from './model/manual-charge';

export interface ChargingService {
    readConfiguration(): Promise<ChargingConfiguration>

    writeLimits(limits: ChargingLimits): Promise<WriteChargingLimitsResult>

    readManualChargeState(): Promise<ManualChargeState>

    startManualCharge(amountWh: number): Promise<boolean>

    stopManualCharge(): Promise<boolean>
}
