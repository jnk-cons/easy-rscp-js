import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {InfoTag} from '../../../src/api/frame/tags/InfoTag';
import {SystemInfoConverter} from '../../../src/service/converter/system-info-converter';
import {RSCPTag, StringFrameConverter} from '../../../src';

describe('string converter tests ', function() {
    it('test omitting values', function () {
        let frame = new FrameBuilder()
            .timestamp(new Date(Date.parse("2024-02-25T15:30:00.00Z")))
            .addData(
                new DataBuilder().tag(RSCPTag.AUTHENTICATION).container(
                    new DataBuilder().tag(RSCPTag.AUTHENTICATION_USER).string("user").build(),
                    new DataBuilder().tag(RSCPTag.AUTHENTICATION_PASSWORD).string("password").build(),
                ).build(),
            ).build()

        const toTest = new StringFrameConverter(true)
        const result = toTest.convert(frame)

        expect(result).toContain("*** - ***")
    })

    it('test clear text values', function () {
        let frame = new FrameBuilder()
            .timestamp(new Date(Date.parse("2024-02-25T15:30:00.00Z")))
            .addData(
                new DataBuilder().tag(RSCPTag.AUTHENTICATION).container(
                    new DataBuilder().tag(RSCPTag.AUTHENTICATION_USER).string("user").build(),
                    new DataBuilder().tag(RSCPTag.AUTHENTICATION_PASSWORD).string("password").build(),
                ).build(),
            ).build()

        const toTest = new StringFrameConverter(false)
        const result = toTest.convert(frame)

        expect(result).toContain("user - 75736572")
        expect(result).toContain("password - 70617373776F7264")
    })

})

