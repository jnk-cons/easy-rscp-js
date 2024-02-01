import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {EPTag} from '../../api/frame/tags/EPTag';
import {BatteryUnit} from '../../api/service/model/battery-unit';
import {Data} from '../../api/frame/data';

export class SetEmergencyPowerReserveCreator implements FrameCreator<PowerReserveInput> {
    create(input: PowerReserveInput): Frame {
        let valueBlock: Data
        if (input.getUnit() == BatteryUnit.PERCENTAGE) {
            valueBlock = new DataBuilder().tag(EPTag.PARAM_EP_RESERVE).float32(input.getValue() * 100.0).build()
        }
        else {
            valueBlock = new DataBuilder().tag(EPTag.PARAM_EP_RESERVE_ENERGY).float32(input.getValue()).build()
        }
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(EPTag.REQ_SET_EP_RESERVE).container(
                    new DataBuilder().tag(EPTag.PARAM_INDEX).uint32(0).build(),
                    valueBlock
                ).build()
            ).build()
    }

}

export class PowerReserveInput {
    constructor(private value: number, private unit: BatteryUnit) {
        if (value < 0.0) {
            throw new Error('The value must not be less than 0')
        }
        else if (unit == BatteryUnit.PERCENTAGE && value > 1.0) {
            throw new Error('The percentage must be between 0.0 and 1.0')
        }
    }

    public getValue(): number {
        return this.value
    }

    public getUnit(): BatteryUnit {
        return this.unit
    }
}
