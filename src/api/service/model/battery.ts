export interface BatterySpec {
    index: number
    name: string
    maxChargingTempCelsius: number
    minChargingTempCelsius: number
    voltage: number
    capacityAh: number
    capacityWh: number
    maxChargeCurrentA: number
    maxDischargeCurrentA: number
    dcbSpecs: DCBSpec[]
}

export interface DCBSpec {
    index: number
    capacityAh: number
    maxChargeCurrentA: number
    maxDischargeCurrentA: number
    fullChargeCapacityAh: number
    voltage: number
    maxChargingTempCelsius: number
    minChargingTempCelsius: number
    serialCells: number
    parallelCells: number
}

export interface BatteryStatus {
    index: number,
    connected: boolean,
    working: boolean,
    inService: boolean,
    asoc: number,
    realRsoc: number,
    voltage: number,
    dcbStatus: DCBStatus[],
    trainingMode: TrainingMode
}

export interface DCBStatus {
    index: number
    voltage: number
    voltageAVG30s: number
    currentA: number
    currentAVG30s: number
    temperaturesCelsius: number[]
}

export enum TrainingMode {
    NOT_IN_TRAINING = 0,
    TRAINING_DISCHARGE = 1,
    TRAINING_CHARGE = 2,
    UNKNOWN = -99
}
