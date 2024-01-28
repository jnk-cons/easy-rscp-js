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
        return new Promise<BatterySpec[]>(async (resolve, reject) => {
            const result: BatterySpec[] = []
            for (let batIndex = 0; batIndex <= 9; batIndex++) {
                const dcbSpecs: DCBSpec[] = []
                const batInfoRequest = this.batInfoRequestCreator.create(batIndex)
                const batInfoResponse = await this.connection.send(batInfoRequest)
                if (batInfoResponse.isDataBlockInError(BatTag.DATA)) {
                    break
                }
                const dcbCount = batInfoResponse.numberByTag(BatTag.DCB_COUNT, BatTag.DATA)
                for (let dcbIndex = 0; dcbIndex < dcbCount; dcbIndex++) {
                    const dcbInfoRequest = this.dcbInfoRequestCreator.create({batIndex: batIndex, dcbIndex: dcbIndex})
                    const dcbInfoResponse = await this.connection.send(dcbInfoRequest)
                    dcbSpecs.push({
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
                }
                result.push({
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
                })
            }
            resolve(result)
        })
    }

    readMonitoringData(): Promise<BatteryStatus[]> {
        return new Promise<BatteryStatus[]>(async (resolve, reject) => {
            const result: BatteryStatus[] = []
            for (let batIndex = 0; batIndex <= 9; batIndex++) {
                const dcbStatus: DCBStatus[] = []
                const batInfoRequest = this.batInfoRequestCreator.create(batIndex)
                const batInfoResponse = await this.connection.send(batInfoRequest)
                if (batInfoResponse.isDataBlockInError(BatTag.DATA)) {
                    break
                }
                const dcbCount = batInfoResponse.numberByTag(BatTag.DCB_COUNT, BatTag.DATA)
                for (let dcbIndex = 0; dcbIndex < dcbCount; dcbIndex++) {
                    const dcbInfoRequest = this.dcbInfoRequestCreator.create({batIndex: batIndex, dcbIndex: dcbIndex})
                    const dcbInfoResponse = await this.connection.send(dcbInfoRequest)
                    dcbStatus.push({
                        index: dcbIndex,
                        voltage: dcbInfoResponse.numberByTag(BatTag.DCB_VOLTAGE, BatTag.DATA, BatTag.DCB_INFO),
                        voltageAVG30s: dcbInfoResponse.numberByTag(BatTag.DCB_VOLTAGE_AVG_30S, BatTag.DATA, BatTag.DCB_INFO),
                        currentA: dcbInfoResponse.numberByTag(BatTag.DCB_CURRENT, BatTag.DATA, BatTag.DCB_INFO),
                        currentAVG30s: dcbInfoResponse.numberByTag(BatTag.DCB_CURRENT_AVG_30S, BatTag.DATA, BatTag.DCB_INFO),
                        temperaturesCelsius: dcbInfoResponse
                            .containerByTag(BatTag.DATA, BatTag.DATA, BatTag.DCB_ALL_CELL_TEMPERATURES)
                            .map(value => value.valueAsNumber())
                    })
                }
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
                result.push({
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
            }
            resolve(result)
        })
    }

}
