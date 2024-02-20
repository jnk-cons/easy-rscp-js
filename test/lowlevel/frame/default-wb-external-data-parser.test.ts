import {DataBuilder, DefaultWbExternalDataParser, WBTag} from '../../../src';

describe('default wb external data parser tests ', function() {
    it('test parsing green', function () {
        const input = new DataBuilder()
            .tag(WBTag.EXTERN_DATA_SUN)
            .container(
                new DataBuilder().tag(WBTag.EXTERN_DATA_LEN).int32(8).build(),
                new DataBuilder().tag(WBTag.EXTERN_DATA).raw('f104522f00000000').build()
            )
            .build()

        const parser = new DefaultWbExternalDataParser()
        const result = parser.parseEnergyData(input)

        expect(result.powerW).toBe(1265)
    })

    it('test Error is thrown if tag is not supported', function () {
        const input = new DataBuilder()
            .tag(WBTag.DEVICE_NAME)
            .container(
                new DataBuilder().tag(WBTag.EXTERN_DATA_LEN).int32(8).build(),
                new DataBuilder().tag(WBTag.EXTERN_DATA).raw('f104522f00000000').build()
            )
            .build()

        const parser = new DefaultWbExternalDataParser()
        try {
            parser.parseEnergyData(input)
            fail('Error expected')
        } catch (e) {
            expect(e).toBeDefined()
        }
    })

    it('test Error is thrown if EXTERN_DATA block is missing', function () {
        const input = new DataBuilder()
            .tag(WBTag.EXTERN_DATA_SUN)
            .container(
                new DataBuilder().tag(WBTag.EXTERN_DATA_LEN).int32(8).build()
            )
            .build()

        const parser = new DefaultWbExternalDataParser()
        try {
            parser.parseEnergyData(input)
            fail('Error expected')
        } catch (e) {
            expect(e).toBeDefined()
        }
    })

})

