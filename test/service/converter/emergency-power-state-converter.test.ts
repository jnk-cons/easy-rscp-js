import {DataType} from '../../../src/api/frame/DataType';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {EMSSysSpecName} from '../../../src/api/frame/EMSSysSpecName';
import {ChargingConfigurationConverter} from '../../../src/service/converter/charging-configuration-converter';
import {StringFrameConverter} from '../../../src/service/converter/string-frame-converter';
import {PowerStateConverter} from '../../../src/service/converter/power-state-converter';
import {EPTag} from '../../../src';
import {EmergencyPowerStateConverter} from '../../../src/service/converter/emergency-power-state-converter';

describe('emergency power state converter tests ', function() {
    it('test conversion', function () {
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(EPTag.EP_RESERVE).container(
                    new DataBuilder().tag(EPTag.PARAM_EP_RESERVE_ENERGY).float32(2000.0).build(),
                    new DataBuilder().tag(EPTag.PARAM_EP_RESERVE).float32(25.3).build(),
                ).build(),
                new DataBuilder().tag(EPTag.IS_GRID_CONNECTED).boolean(true).build(),
                new DataBuilder().tag(EPTag.IS_READY_FOR_SWITCH).boolean(true).build(),
                new DataBuilder().tag(EPTag.IS_POSSIBLE).boolean(true).build(),
                new DataBuilder().tag(EPTag.IS_INVALID_STATE).boolean(true).build(),
                new DataBuilder().tag(EPTag.IS_ISLAND_GRID).boolean(true).build(),
            )
            .build()

        const toTest = new EmergencyPowerStateConverter()
        const result = toTest.convert(frame)

        expect(result.emergencyPowerPossible).toBeTrue()
        expect(result.invalidState).toBeTrue()
        expect(result.island).toBeTrue()
        expect(result.readyForSwitch).toBeTrue()
        expect(result.connectedToGrid).toBeTrue()

        expect(result.reservePercentage).toBeCloseTo(0.253, 0.0001)
        expect(result.reserveWh).toBeCloseTo(2000, 0.0001)
    })

})

