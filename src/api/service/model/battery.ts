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
    trainingModeActive: boolean,
    connected: boolean,
    working: boolean,
    inService: boolean,
    asoc: number,
    realRsoc: number,
    voltage: number,
    dcbStatus: DCBStatus[],
}

export interface DCBStatus {
    index: number
    voltage: number
    voltageAVG30s: number
    currentA: number
    currentAVG30s: number
    temperaturesCelsius: number[]
}
