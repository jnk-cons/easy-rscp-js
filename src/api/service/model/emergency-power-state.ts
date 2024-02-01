export interface EmergencyPowerState {
    reserveWh: number
    reservePercentage: number
    connectedToGrid: Boolean
    readyForSwitch: Boolean
    emergencyPowerPossible: Boolean
    island: Boolean
    invalidState: Boolean
}
