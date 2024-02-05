import {LiveDataService} from '../api/service/live-data-service';
import {PowerState} from '../api/service/model/power-state';
import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {RequestLiveDataCreator} from './creator/request-live-data-creator';
import {FrameConverter} from './converter/frame-converter';
import {PowerStateConverter} from './converter/power-state-converter';

export class DefaultLiveDataService implements LiveDataService {

    constructor(
        private connection: HomePowerPlantConnection,
        private requestCreator: FrameCreator<undefined> = new RequestLiveDataCreator(),
        private responseConverter: FrameConverter<PowerState> = new PowerStateConverter()) {
    }
    readPowerState(): Promise<PowerState> {
        return new Promise<PowerState>((resolve, reject) => {
            const request = this.requestCreator.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const result = this.responseConverter.convert(response)
                        resolve(result)
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))


        });
    }

}
