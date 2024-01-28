import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {InfoTag} from '../../../src/api/frame/tags/InfoTag';
import {SystemInfoConverter} from '../../../src/service/converter/system-info-converter';

describe('system info converter tests ', function() {
    it('test conversion', function () {
        let frame = new FrameBuilder()
            .addData(
                new DataBuilder().tag(InfoTag.SERIAL_NUMBER).string("12345").build(),
                new DataBuilder().tag(InfoTag.SW_RELEASE).string("6789").build(),
                new DataBuilder().tag(InfoTag.PRODUCTION_DATE).string("KW22 2022").build(),
            ).build()

        const toTest = new SystemInfoConverter()
        const result = toTest.convert(frame)

        expect(result.serialNumber).toBe("12345")
        expect(result.softwareVersion).toBe("6789")
        expect(result.productionDate.rscpValue).toBe("KW22 2022")
        expect(result.productionDate.calendarWeek).toBe(22)
        expect(result.productionDate.year).toBe(2022)
    })

})

