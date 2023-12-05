import {E3dcConnectionData} from '../../src/api/connection/e3dc-connection-data';
import {DefaultLiveDataService} from '../../src/service/default-live-data-service';
import {
    DefaultHomePowerPlantConnectionFactory
} from '../../src/lowlevel/connection/default-home-power-plant-connection-factory';


describe('live data service integration tests', function() {
    const connectionData: E3dcConnectionData = {
        address: process.env['RSCP_IP']!!,
        portalUser: process.env['PORTAL_USER']!!,
        portalPassword: process.env['PORTAL_PASSWORD']!!,
        rscpPassword: process.env['RSCP_PASSWORD']!!,
        port: 5033
    }

    const factory = new DefaultHomePowerPlantConnectionFactory(connectionData)

    it('service test', async function() {
        const connection = await factory.openConnection()
        const service = new DefaultLiveDataService(connection)
        const result = await service.readPowerState()
        console.log(result)
        await connection.disconnect()
    });
});
