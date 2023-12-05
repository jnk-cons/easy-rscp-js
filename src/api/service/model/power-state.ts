export interface PowerState {
    timestamp: Date
    pvDelivery: number
    gridDelivery: number
    batteryDelivery: number
    houseConsumption: number
    batteryChargingLevel: number
}
