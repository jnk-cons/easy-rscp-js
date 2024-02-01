import {HomePowerPlantConnection} from '../api/connection/home-power-plant-connection';
import {FrameCreator} from './creator/frame-creator';
import {FrameConverter} from './converter/frame-converter';
import {EmergencyPowerService} from '../api/service/emergency-power-service';
import {EmergencyPowerState} from '../api/service/model/emergency-power-state';
import {EmergencyPowerStateConverter} from './converter/emergency-power-state-converter';
import {ReadEmergencyPowerStateCreator} from './creator/read-emergency-power-state-creator';
import {PowerReserveInput, SetEmergencyPowerReserveCreator} from './creator/set-emergency-power-reserve-creator';
import {BatteryUnit} from '../api/service/model/battery-unit';

export class DefaultEmergencyPowerService implements EmergencyPowerService {

    constructor(
        private connection: HomePowerPlantConnection,
        private convertFrameToEmergencyPowerState: FrameConverter<EmergencyPowerState> = new EmergencyPowerStateConverter(),
        private createReadStateFrame: FrameCreator<undefined> = new ReadEmergencyPowerStateCreator(),
        private createSetEmergencyPowerReserveFrame: FrameCreator<PowerReserveInput> = new SetEmergencyPowerReserveCreator()
    ) {
    }

    readState(): Promise<EmergencyPowerState> {
        return new Promise((resolve, reject) => {
            const request = this.createReadStateFrame.create(undefined)
            this.connection
                .send(request)
                .then(response => {
                    const result = this.convertFrameToEmergencyPowerState.convert(response)
                    resolve(result)
                })
                .catch(e => reject(e))
        })
    }

    removeReserve(): Promise<EmergencyPowerState> {
        return this.setReserve(0.0, BatteryUnit.PERCENTAGE)
    }

    setReservePercentage(reserve: number): Promise<EmergencyPowerState> {
        return this.setReserve(reserve, BatteryUnit.PERCENTAGE)
    }

    setReserveWH(reserve: number): Promise<EmergencyPowerState> {
        return this.setReserve(reserve, BatteryUnit.WATT_HOURS)
    }

    private setReserve(reserve: number, unit: BatteryUnit): Promise<EmergencyPowerState> {
        return new Promise((resolve, reject) => {
            let input: PowerReserveInput
            try {
                input = new PowerReserveInput(reserve, unit)
                const request = this.createSetEmergencyPowerReserveFrame.create(input)
                this.connection
                    .send(request)
                    .then(_ => {
                        this.readState()
                            .then(value => resolve(value))
                            .catch(reason => reject(reason))
                    })
                    .catch(reason => reject(reason))

            } catch (e) {
                reject(e)
            }
        })
    }

}
