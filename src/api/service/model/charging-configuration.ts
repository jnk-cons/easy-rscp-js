import {ResultCode} from './result-code';

export interface ChargingConfiguration {
    maxPossibleChargingPower: number
    maxPossibleDischargingPower: number
    minPossibleChargingPower: number
    minPossibleDischargingPower: number
    defaultStartChargingThreshold: number
    currentLimitations: ChargingLimits
}

export interface ChargingLimits {
    maxCurrentChargingPower: number
    maxCurrentDischargingPower: number
    dischargeStartPower: number
    chargingLimitationsEnabled: boolean
}

export interface WriteChargingLimitsResult {
    maxCurrentChargingPower: ResultCode,
    maxCurrentDischargingPower: ResultCode,
    dischargeStartPower: ResultCode,
    chargingLimitationsEnabled: ResultCode
}
