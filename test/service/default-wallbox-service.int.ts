import {E3dcConnectionData} from '../../src/api/connection/e3dc-connection-data';
import {DefaultLiveDataService} from '../../src/service/default-live-data-service';
import {
    DefaultHomePowerPlantConnectionFactory
} from '../../src/lowlevel/connection/default-home-power-plant-connection-factory';
import {DefaultWallboxService} from '../../src';


describe('wallbox service integration tests', function() {
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
        const service = new DefaultWallboxService(connection)
        console.log("Reading connected devices:")
        const result = await service.readConnectedWallboxes()
        console.log(result)
        console.log("Reading live data")
        const result2 = await service.readPowerState(result.map(value => value.id))
        console.log(result2)


        await connection.disconnect()
    });

});
