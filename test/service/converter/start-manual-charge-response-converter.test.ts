import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {EMSTag} from '../../../src';
import {
    StartManualChargeResponseConverter
} from '../../../src/service/converter/start-manual-charge-response-converter';

describe('manual charge state converter tests ', function() {
    it('test conversion', function () {
        const timestamp = new Date()
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(EMSTag.START_MANUAL_CHARGE).boolean(true).build()
            ).build()

        const toTest = new StartManualChargeResponseConverter()
        const result = toTest.convert(frame)

        expect(result).toBe(true)
    })

})

