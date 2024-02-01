import {EmergencyPowerState} from './model/emergency-power-state';

export interface EmergencyPowerService {
    removeReserve(): Promise<EmergencyPowerState>
    setReserveWH(reserve: number): Promise<EmergencyPowerState>
    setReservePercentage(reserve: number): Promise<EmergencyPowerState>
    readState(): Promise<EmergencyPowerState>
}
