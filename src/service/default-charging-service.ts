import {ChargingService} from '../api/service/charging-service';
import {
    ChargingConfiguration,
    ChargingLimits,
    WriteChargingLimitsResult
} from '../api/service/model/charging-configuration';
import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {RequestChargingConfigurationCreator} from './creator/request-charging-configuration-creator';
import {FrameConverter} from './converter/frame-converter';
import {ChargingConfigurationConverter} from './converter/charging-configuration-converter';
import {SetPowerSettingsCreator} from './creator/set-power-settings-creator';
import {WriteChargingLimitsResultConverter} from './converter/write-charging-limits-result-converter';
import {ManualChargeState} from '../api/service/model/manual-charge';
import {RequestManualChargeStateCreator} from './creator/request-manual-charge-state-creator';
import {RequestStartManualChargeCreator} from './creator/request-start-manual-charge-creator';
import {ManualChargeStateConverter} from './converter/manual-charge-state-converter';
import {StartManualChargeResponseConverter} from './converter/start-manual-charge-response-converter';

export class DefaultChargingService implements ChargingService {

    constructor(
        private connection: HomePowerPlantConnection,
        private readChargingConfigurationRequestCreator: FrameCreator<undefined> = new RequestChargingConfigurationCreator(),
        private readChargingConfigurationConverter: FrameConverter<ChargingConfiguration> = new ChargingConfigurationConverter(),
        private writeChargingLimitsRequestCreator: FrameCreator<ChargingLimits> = new SetPowerSettingsCreator(),
        private writeChargingLimitsConverter: FrameConverter<WriteChargingLimitsResult> = new WriteChargingLimitsResultConverter(),
        private readManualChargeStateCreator: FrameCreator<undefined> = new RequestManualChargeStateCreator(),
        private requestManualChargeCreator: FrameCreator<number> = new RequestStartManualChargeCreator(),
        private manualChargeStateConverter: FrameConverter<ManualChargeState> = new ManualChargeStateConverter(),
        private requestStartManualChargeResponseConverter: FrameConverter<boolean> = new StartManualChargeResponseConverter()
    ) {
    }
    readConfiguration(): Promise<ChargingConfiguration> {
        return new Promise<ChargingConfiguration>((resolve, reject) => {
            const request = this.readChargingConfigurationRequestCreator.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.readChargingConfigurationConverter.convert(response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

    writeLimits(limits: ChargingLimits): Promise<WriteChargingLimitsResult> {
        return new Promise<WriteChargingLimitsResult>((resolve, reject) => {
            const request = this.writeChargingLimitsRequestCreator.create(limits)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.writeChargingLimitsConverter.convert(response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

    readManualChargeState(): Promise<ManualChargeState> {
        return new Promise<ManualChargeState>((resolve, reject) => {
            const request = this.readManualChargeStateCreator.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.manualChargeStateConverter.convert(response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

    startManualCharge(amountWh: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const request = this.requestManualChargeCreator.create(amountWh)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.requestStartManualChargeResponseConverter.convert(response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        });
    }

    stopManualCharge(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.readManualChargeState()
                .then(state => {
                    if (state.active) {
                        this.startManualCharge(0)
                            .then(value => resolve(value))
                            .catch(reason => reject(reason))
                    }
                    else {
                        resolve(true)
                    }
                })
                .catch(reason => reject(reason))
        })
    }


}
