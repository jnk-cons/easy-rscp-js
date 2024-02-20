import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {FrameConverter} from './converter/frame-converter';
import {WallboxService} from '../api/service/wallbox-service';
import {WallboxInfo} from '../api/service/model/wallbox-info';
import {WallboxPowerState} from '../api/service/model/wallbox-power-state';
import {WallboxDeviceIdsConverter} from './converter/wallbox-device-ids-converter';
import {WallboxDeviceInfosConverter} from './converter/wallbox-device-infos-converter';
import {WallboxPowerStateConverter} from './converter/wallbox-power-state-converter';
import {RequestWallboxIdsCreator} from './creator/request-wallbox-ids-creator';
import {RequestWallboxInfosCreator} from './creator/request-wallbox-infos-creator';
import {RequestWallboxLiveDataCreator} from './creator/request-wallbox-live-data-creator';

export class DefaultWallboxService implements WallboxService {

    constructor(
        private connection: HomePowerPlantConnection,
        private convertConnectedIdsConverter: FrameConverter<number[]> = new WallboxDeviceIdsConverter(),
        private convertWallboxInfosConverter: FrameConverter<WallboxInfo[]> = new WallboxDeviceInfosConverter(),
        private convertWallboxLiveDataConverter: FrameConverter<WallboxPowerState[]> = new WallboxPowerStateConverter(),
        private createRequestConnectedWallboxes: FrameCreator<undefined> = new RequestWallboxIdsCreator(),
        private createRequestWallboxInfos: FrameCreator<number[]> = new RequestWallboxInfosCreator(),
        private createRequestWallboxLiveData: FrameCreator<number[]> = new RequestWallboxLiveDataCreator()) {
    }

    readConnectedWallboxes(): Promise<WallboxInfo[]> {
        return new Promise<WallboxInfo[]>((resolve, reject) => {
            const request = this.createRequestConnectedWallboxes.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    try {
                        const ids = this.convertConnectedIdsConverter.convert(response)
                        if (ids.length == 0) {
                            resolve([])
                        }
                        else {
                            this.connection
                                .send(this.createRequestWallboxInfos.create(ids))
                                .then(infoResponse => {
                                    try {
                                        const result = this.convertWallboxInfosConverter.convert(infoResponse)
                                        resolve(result)
                                    } catch (e) {
                                        reject(e)
                                    }
                                })
                                .catch(reason => reject(reason))
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
                .catch(e => reject(e))
        })
    }

    readPowerState(ids: number[]): Promise<WallboxPowerState[]> {
        return new Promise((resolve, reject) => {
            if (ids.length == 0) {
                reject(new Error('Parameter ids can not be empty'))
            }
            else {
                const request = this.createRequestWallboxLiveData.create(ids)
                this.connection
                    .send(request)
                    .then(response => {
                        try {
                            const result = this.convertWallboxLiveDataConverter.convert(response)
                            resolve(result)
                        } catch (e) {
                            reject(e)
                        }
                    })
                    .catch(e => reject(e))
            }

        })
    }
}
