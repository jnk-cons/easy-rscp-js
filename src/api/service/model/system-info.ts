export interface SystemInfo {
    serialNumber: string
    softwareVersion: string
    productionDate: ProductionDate
}

export interface ProductionDate {
    rscpValue: string,
    calendarWeek: number,
    year: number
}
