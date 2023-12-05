import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {RequestLiveDataCreator} from './creator/request-live-data-creator';
import {FrameConverter} from './converter/frame-converter';
import {InfoService} from '../api/service/info-service';
import {SystemInfo} from '../api/service/model/system-info';
import {SystemInfoConverter} from './converter/system-info-converter';
import {RequestSystemInfosCreator} from './creator/request-system-infos-creator';

export class DefaultInfoService implements InfoService {

    constructor(
        private connection: HomePowerPlantConnection,
        private requestCreator: FrameCreator<undefined> = new RequestSystemInfosCreator(),
        private responseConverter: FrameConverter<SystemInfo> = new SystemInfoConverter()) {
    }

    readSystemInfo(): Promise<SystemInfo> {
        return new Promise<SystemInfo>((resolve, reject) => {
            const request = this.requestCreator.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    const result = this.responseConverter.convert(response)
                    resolve(result)
                })
                .catch(e => reject(e))


        });
    }

}
