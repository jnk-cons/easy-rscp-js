import {E3dcConnectionData} from '../../src/api/connection/e3dc-connection-data';
import {DefaultLiveDataService} from '../../src/service/default-live-data-service';
import {
    DefaultHomePowerPlantConnectionFactory
} from '../../src/lowlevel/connection/default-home-power-plant-connection-factory';
import {DefaultInfoService} from '../../src/service/default-info-service';
import {RijndaelJsAESCipherFactory} from '../../src/lowlevel/crypt/rijndael-js-aes-cipher-factory';
import {DefaultSocketFactory} from '../../src/lowlevel/connection/default-socket-factory';
import {DefaultFrameParser} from '../../src/lowlevel/frame/default-frame-parser';
import {PrintRequestAndAnswerListener} from '../../src/service/listener/print-request-and-answer-listener';


describe('info service integration tests', function() {
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

    it('service test', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultInfoService(connection)
        const result = await service.readSystemInfo()
        console.log(result)
        await connection.disconnect()
    });
});
