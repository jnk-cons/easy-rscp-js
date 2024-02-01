import {E3dcConnectionData} from '../../src/api/connection/e3dc-connection-data';
import {
    DefaultHomePowerPlantConnectionFactory
} from '../../src/lowlevel/connection/default-home-power-plant-connection-factory';
import {RijndaelJsAESCipherFactory} from '../../src/lowlevel/crypt/rijndael-js-aes-cipher-factory';
import {DefaultSocketFactory} from '../../src/lowlevel/connection/default-socket-factory';
import {DefaultFrameParser} from '../../src/lowlevel/frame/default-frame-parser';
import {PrintRequestAndAnswerListener} from '../../src/service/listener/print-request-and-answer-listener';
import {DefaultEmergencyPowerService} from '../../src';


describe('emergency power service integration tests', function() {
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

    it('read state', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultEmergencyPowerService(connection)
        const result = await service.readState()
        console.log(result)
        await connection.disconnect()
    });

    it('set reserve with WH', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultEmergencyPowerService(connection)
        const result = await service.setReserveWH(1500)
        console.log(result)
        await connection.disconnect()
    });

    it('set reserve with percentage', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultEmergencyPowerService(connection)
        const result = await service.setReservePercentage(0.1)
        console.log(result)
        await connection.disconnect()
    });

    it('remove reserve', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultEmergencyPowerService(connection)
        const result = await service.removeReserve()
        console.log(result)
        await connection.disconnect()
    });
});
