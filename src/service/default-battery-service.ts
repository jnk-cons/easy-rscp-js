import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {BatteryService} from '../api/service/battery-service';
import {BatterySpec, BatteryStatus, DCBSpec, DCBStatus, TrainingMode} from '../api/service/model/battery';
import {BatteryInfoRequestCreator} from './creator/battery-info-request-creator';
import {DCBIdent, DcbInfoRequestCreator} from './creator/dcb-info-request-creator';
import {BatTag} from '../api/frame/tags/BatTag';

export class DefaultBatteryService implements BatteryService {

    constructor(
        private connection: HomePowerPlantConnection,
        private batInfoRequestCreator: FrameCreator<number> = new BatteryInfoRequestCreator(),
        private dcbInfoRequestCreator: FrameCreator<DCBIdent> = new DcbInfoRequestCreator()) {
    }

    readSpecification(): Promise<BatterySpec[]> {
        const loader = new SpecificationLoader(this.connection, this.batInfoRequestCreator, this.dcbInfoRequestCreator)
        return loader.loadSpecification()
    }

    readMonitoringData(): Promise<BatteryStatus[]> {
        const loader = new MonitoringLoader(this.connection, this.batInfoRequestCreator, this.dcbInfoRequestCreator)
        return loader.loadMonitoring()
    }

}

class SpecificationLoader {
    constructor(
        public connection: HomePowerPlantConnection,
        private batInfoRequestCreator: FrameCreator<number> = new BatteryInfoRequestCreator(),
        private dcbInfoRequestCreator: FrameCreator<DCBIdent> = new DcbInfoRequestCreator()
    ) {
    }

    loadSpecification():Promise<BatterySpec[]> {
        return new Promise((resolve, reject) => {
            const result: BatterySpec[] = []
            this.doSpecificationLoading(0)
                .then(current => {
                    this.handleSpecificationResult(current, result, resolve, reject);
                })
                .catch(e => reject(e))
        })
    }

    private handleSpecificationResult(
        spec: BatterySpec | null,
        result: BatterySpec[],
        finalResolve: ((value: BatterySpec[] | PromiseLike<BatterySpec[]>) => void),
        finalReject: ((reason?: any) => void)) {
        if (spec) {
            result.push(spec)
            this.doSpecificationLoading(spec.index + 1)
                .then(current => {
                    this.handleSpecificationResult(current, result, finalResolve, finalReject);
                })
                .catch(e => finalReject(e))
        } else {
            finalResolve(result)
        }
    }

    private doSpecificationLoading(batIndex: number): Promise<BatterySpec | null> {
        return new Promise((resolve, reject) => {
            const batInfoRequest = this.batInfoRequestCreator.create(batIndex)
            this.connection.send(batInfoRequest)
                .then(batInfoResponse => {
                    try {
                        if (batInfoResponse.isDataBlockInError(BatTag.DATA)) {
                            resolve(null) // HPS has no battery with the given index
                        } else {
                            const dcbCount = batInfoResponse.numberByTag(BatTag.DCB_COUNT, BatTag.DATA)
                            const dcbSpecLoader = new DCBSpecificationLoader(this.connection, this.dcbInfoRequestCreator)
                            dcbSpecLoader.loadSpecification(batIndex, dcbCount)
                                .then(dcbSpecs => {
                                    try {
                                        resolve(
                                            {
                                                index: batIndex,
                                                name: batInfoResponse.stringByTag(BatTag.DEVICE_NAME, BatTag.DATA),
                                                maxChargingTempCelsius: batInfoResponse.numberByTag(BatTag.CHARGE_HIGH_TEMP, BatTag.DATA),
                                                minChargingTempCelsius: batInfoResponse.numberByTag(BatTag.CHARGE_LOW_TEMP, BatTag.DATA),
                                                voltage: batInfoResponse.numberByTag(BatTag.DESIGN_VOLTAGE, BatTag.DATA),
                                                capacityAh: batInfoResponse.numberByTag(BatTag.DESIGN_CAPACITY, BatTag.DATA),
                                                capacityWh: batInfoResponse.numberByTag(BatTag.SPECIFIED_CAPACITY, BatTag.DATA, BatTag.SPECIFICATION),
                                                maxChargeCurrentA: batInfoResponse.numberByTag(BatTag.MAX_CHARGE_CURRENT, BatTag.DATA),
                                                maxDischargeCurrentA: batInfoResponse.numberByTag(BatTag.MAX_DISCHARGE_CURRENT, BatTag.DATA),
                                                dcbSpecs: dcbSpecs,
                                            }
                                        )
                                    } catch (e) {
                                        reject(e)
                                    }

                                })
                                .catch(e => reject(e))
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        })
    }
}

class DCBSpecificationLoader {
    constructor(
        public connection: HomePowerPlantConnection,
        private dcbInfoRequestCreator: FrameCreator<DCBIdent> = new DcbInfoRequestCreator()
    ) {
    }

    loadSpecification(batIndex: number, dcbCount: number):Promise<DCBSpec[]> {
        return new Promise((resolve, reject) => {
            const result: DCBSpec[] = []
            this.doSpecificationLoading(batIndex, 0)
                .then(current => {
                    this.handleSpecificationResult(current, result, batIndex, dcbCount, resolve, reject);
                })
                .catch(e => reject(e))
        })

    }

    private handleSpecificationResult(
        spec: DCBSpec,
        result: DCBSpec[],
        batIndex: number,
        dcbCount: number,
        finalResolve: ((value: DCBSpec[] | PromiseLike<DCBSpec[]>) => void),
        finalReject: ((reason?: any) => void)) {
        result.push(spec)
        if (spec.index + 1 < dcbCount) {
            this.doSpecificationLoading(batIndex, spec.index + 1)
                .then(value => {
                    this.handleSpecificationResult(value, result, batIndex, dcbCount, finalResolve, finalReject)
                })
                .catch(e => finalReject(e))
        }
        else {
            finalResolve(result)
        }
    }

    private doSpecificationLoading(batIndex: number, dcbIndex: number): Promise<DCBSpec> {
        return new Promise((resolve, reject) => {
            const dcbInfoRequest = this.dcbInfoRequestCreator.create({batIndex: batIndex, dcbIndex: dcbIndex})
            this.connection.send(dcbInfoRequest)
                .then(dcbInfoResponse => {
                    try {
                        resolve({
                            index: dcbIndex,
                            capacityAh: dcbInfoResponse.numberByTag(BatTag.DCB_DESIGN_CAPACITY, BatTag.DATA, BatTag.DCB_INFO),
                            maxChargeCurrentA: dcbInfoResponse.numberByTag(BatTag.DCB_MAX_CHARGE_CURRENT, BatTag.DATA, BatTag.DCB_INFO),
                            maxDischargeCurrentA: dcbInfoResponse.numberByTag(BatTag.DCB_MAX_DISCHARGE_CURRENT, BatTag.DATA, BatTag.DCB_INFO),
                            fullChargeCapacityAh: dcbInfoResponse.numberByTag(BatTag.DCB_FULL_CHARGE_CAPACITY, BatTag.DATA, BatTag.DCB_INFO),
                            voltage: dcbInfoResponse.numberByTag(BatTag.DCB_DESIGN_VOLTAGE, BatTag.DATA, BatTag.DCB_INFO),
                            maxChargingTempCelsius: dcbInfoResponse.numberByTag(BatTag.DCB_CHARGE_HIGH_TEMPERATURE, BatTag.DATA, BatTag.DCB_INFO),
                            minChargingTempCelsius: dcbInfoResponse.numberByTag(BatTag.DCB_CHARGE_LOW_TEMPERATURE, BatTag.DATA, BatTag.DCB_INFO),
                            serialCells: dcbInfoResponse.numberByTag(BatTag.DCB_NR_SERIES_CELL, BatTag.DATA, BatTag.DCB_INFO),
                            parallelCells: dcbInfoResponse.numberByTag(BatTag.DCB_NR_PARALLEL_CELL, BatTag.DATA, BatTag.DCB_INFO),
                        })
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        })
    }
}

class MonitoringLoader {
    constructor(
        public connection: HomePowerPlantConnection,
        private batInfoRequestCreator: FrameCreator<number> = new BatteryInfoRequestCreator(),
        private dcbInfoRequestCreator: FrameCreator<DCBIdent> = new DcbInfoRequestCreator()
    ) {
    }

    loadMonitoring():Promise<BatteryStatus[]> {
        return new Promise((resolve, reject) => {
            const result: BatteryStatus[] = []
            this.doMonitoringLoading(0)
                .then(current => {
                    this.handleMonitoringResult(current, result, resolve, reject);
                })
                .catch(e => reject(e))
        })
    }

    private handleMonitoringResult(
        spec: BatteryStatus | null,
        result: BatteryStatus[],
        finalResolve: ((value: BatteryStatus[] | PromiseLike<BatteryStatus[]>) => void),
        finalReject: ((reason?: any) => void)) {
        if (spec) {
            result.push(spec)
            this.doMonitoringLoading(spec.index + 1)
                .then(current => {
                    this.handleMonitoringResult(current, result, finalResolve, finalReject);
                })
                .catch(e => finalReject(e))
        } else {
            finalResolve(result)
        }
    }

    private doMonitoringLoading(batIndex: number): Promise<BatteryStatus | null> {
        return new Promise((resolve, reject) => {
            const batInfoRequest = this.batInfoRequestCreator.create(batIndex)
            this.connection.send(batInfoRequest)
                .then(batInfoResponse => {
                    try {
                        if (batInfoResponse.isDataBlockInError(BatTag.DATA)) {
                            resolve(null) // HPS has no battery with the given index
                        } else {
                            const dcbCount = batInfoResponse.numberByTag(BatTag.DCB_COUNT, BatTag.DATA)
                            const dcbMonitoringLoader = new DCBMonitoringLoader(this.connection, this.dcbInfoRequestCreator)
                            dcbMonitoringLoader.loadMonitoring(batIndex, dcbCount)
                                .then(dcbStatus => {
                                    try {
                                        const trainingModeRAW = batInfoResponse.numberByTag(BatTag.TRAINING_MODE, BatTag.DATA)
                                        let trainingMode: TrainingMode = TrainingMode.UNKNOWN
                                        if (trainingModeRAW == 0) {
                                            trainingMode = TrainingMode.NOT_IN_TRAINING
                                        }
                                        else if (trainingModeRAW == 1) {
                                            trainingMode = TrainingMode.TRAINING_DISCHARGE
                                        }
                                        else if (trainingModeRAW == 1) {
                                            trainingMode = TrainingMode.TRAINING_CHARGE
                                        }
                                        resolve({
                                            index: batIndex,
                                            trainingMode: trainingMode,
                                            connected: batInfoResponse.booleanByTag(BatTag.DEVICE_CONNECTED, BatTag.DATA, BatTag.DEVICE_STATE),
                                            working: batInfoResponse.booleanByTag(BatTag.DEVICE_WORKING, BatTag.DATA, BatTag.DEVICE_STATE),
                                            inService: batInfoResponse.booleanByTag(BatTag.DEVICE_IN_SERVICE, BatTag.DATA, BatTag.DEVICE_STATE),
                                            asoc: batInfoResponse.numberByTag(BatTag.ASOC, BatTag.DATA) / 100.0,
                                            realRsoc: batInfoResponse.numberByTag(BatTag.RSOC_REAL, BatTag.DATA) / 100.0,
                                            voltage: batInfoResponse.numberByTag(BatTag.MODULE_VOLTAGE, BatTag.DATA),
                                            dcbStatus: dcbStatus
                                        })
                                    } catch (e) {
                                        reject(e)
                                    }

                                })
                                .catch(e => reject(e))
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        })
    }
}

class DCBMonitoringLoader {
    constructor(
        public connection: HomePowerPlantConnection,
        private dcbInfoRequestCreator: FrameCreator<DCBIdent> = new DcbInfoRequestCreator()
    ) {
    }

    loadMonitoring(batIndex: number, dcbCount: number):Promise<DCBStatus[]> {
        return new Promise((resolve, reject) => {
            const result: DCBStatus[] = []
            this.doMonitoringLoading(batIndex, 0)
                .then(current => {
                    this.handleMonitoringResult(current, result, batIndex, dcbCount, resolve, reject);
                })
                .catch(e => reject(e))
        })

    }

    private handleMonitoringResult(
        data: DCBStatus,
        result: DCBStatus[],
        batIndex: number,
        dcbCount: number,
        finalResolve: ((value: DCBStatus[] | PromiseLike<DCBStatus[]>) => void),
        finalReject: ((reason?: any) => void)) {
        result.push(data)
        if (data.index + 1 < dcbCount) {
            this.doMonitoringLoading(batIndex, data.index + 1)
                .then(value => {
                    this.handleMonitoringResult(value, result, batIndex, dcbCount, finalResolve, finalReject)
                })
                .catch(e => finalReject(e))
        }
        else {
            finalResolve(result)
        }
    }

    private doMonitoringLoading(batIndex: number, dcbIndex: number): Promise<DCBStatus> {
        return new Promise((resolve, reject) => {
            const dcbInfoRequest = this.dcbInfoRequestCreator.create({batIndex: batIndex, dcbIndex: dcbIndex})
            this.connection.send(dcbInfoRequest)
                .then(dcbInfoResponse => {
                    try {
                        resolve({
                            index: dcbIndex,
                            voltage: dcbInfoResponse.numberByTag(BatTag.DCB_VOLTAGE, BatTag.DATA, BatTag.DCB_INFO),
                            voltageAVG30s: dcbInfoResponse.numberByTag(BatTag.DCB_VOLTAGE_AVG_30S, BatTag.DATA, BatTag.DCB_INFO),
                            currentA: dcbInfoResponse.numberByTag(BatTag.DCB_CURRENT, BatTag.DATA, BatTag.DCB_INFO),
                            currentAVG30s: dcbInfoResponse.numberByTag(BatTag.DCB_CURRENT_AVG_30S, BatTag.DATA, BatTag.DCB_INFO),
                            temperaturesCelsius: dcbInfoResponse
                                .containerByTag(BatTag.DATA, BatTag.DATA, BatTag.DCB_ALL_CELL_TEMPERATURES)
                                .map(value => value.valueAsNumber())
                        })
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        })
    }
}
