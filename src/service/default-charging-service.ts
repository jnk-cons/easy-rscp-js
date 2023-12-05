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

export class DefaultChargingService implements ChargingService {

    constructor(
        private connection: HomePowerPlantConnection,
        private readChargingConfigurationRequestCreator: FrameCreator<undefined> = new RequestChargingConfigurationCreator(),
        private readChargingConfigurationConverter: FrameConverter<ChargingConfiguration> = new ChargingConfigurationConverter(),
        private writeChargingLimitsRequestCreator: FrameCreator<ChargingLimits> = new SetPowerSettingsCreator(),
        private writeChargingLimitsConverter: FrameConverter<WriteChargingLimitsResult> = new WriteChargingLimitsResultConverter(),
    ) {
    }
    readConfiguration(): Promise<ChargingConfiguration> {
        return new Promise<ChargingConfiguration>((resolve, reject) => {
            const request = this.readChargingConfigurationRequestCreator.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    const result = this.readChargingConfigurationConverter.convert(response)
                    resolve(result)
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
                    const result = this.writeChargingLimitsConverter.convert(response)
                    resolve(result)
                })
                .catch(e => reject(e))
        });
    }

}


