import {
    DataBuilder, DefaultChargingService,
    DefaultFrameParser,
    DefaultHomePowerPlantConnectionFactory, DefaultInfoService,
    DefaultSocketFactory,
    E3dcConnectionData, FrameBuilder, InfoTag, PrintRequestAndAnswerListener, RequestChargingConfigurationCreator,
    RijndaelJsAESCipherFactory, StringFrameConverter
} from '../../src';

describe('request tester', function() {
    const connectionData: E3dcConnectionData = {
        address: process.env['RSCP_IP']!!,
        portalUser: process.env['PORTAL_USER']!!,
        portalPassword: process.env['PORTAL_PASSWORD']!!,
        rscpPassword: process.env['RSCP_PASSWORD']!!,
        port: 5033
    }

    const factory = new DefaultHomePowerPlantConnectionFactory(
        connectionData,
        new RijndaelJsAESCipherFactory(connectionData.rscpPassword),
        new DefaultSocketFactory(),
        new DefaultFrameParser(),
        [new PrintRequestAndAnswerListener()])

    it('execute test', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultChargingService(connection)

        const result = await service.readManualChargeState()
        console.log(result)

        await connection.disconnect()
    });
});
