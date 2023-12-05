import {DataType} from '../../../src/api/frame/DataType';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {DefaultHomePowerPlantConnection} from '../../../src/lowlevel/connection/default-home-power-plant-connection';
import {E3dcConnectionData} from '../../../src/api/connection/e3dc-connection-data';
import {RijndaelJsAESCipherFactory} from '../../../src/lowlevel/crypt/rijndael-js-aes-cipher-factory';
import {FrameBuilder} from '../../../src/lowlevel/frame/frame-builder';
import {DataBuilder} from '../../../src/lowlevel/frame/data-builder';
import {RSCPTag} from '../../../src/api/frame/tags/RSCPTag';
import {
    DefaultHomePowerPlantConnectionFactory
} from '../../../src/lowlevel/connection/default-home-power-plant-connection-factory';
import {StringFrameConverter} from '../../../src/service/converter/string-frame-converter';

describe('home power plant connection factory integration tests', function() {
    const connectionData: E3dcConnectionData = {
        address: process.env['RSCP_IP']!!,
        portalUser: process.env['PORTAL_USER']!!,
        portalPassword: process.env['PORTAL_PASSWORD']!!,
        rscpPassword: process.env['RSCP_PASSWORD']!!,
        port: 5033
    }

    const aesFactory = new RijndaelJsAESCipherFactory(connectionData.rscpPassword)

    it('call test', async function () {
        const factory = new DefaultHomePowerPlantConnectionFactory(connectionData)

        const connection = await factory.openConnection()

        const requestDataFrame = new FrameBuilder()
            .enableChecksum()
            .addData(
                new DataBuilder().tag(EMSTag.REQ_POWER_PV).build(),
                new DataBuilder().tag(EMSTag.REQ_POWER_BAT).build(),
                new DataBuilder().tag(EMSTag.REQ_POWER_GRID).build(),
                new DataBuilder().tag(EMSTag.REQ_POWER_HOME).build(),
                new DataBuilder().tag(EMSTag.REQ_BAT_SOC).build(),
            )
            .build()
        const dataAnswer = await connection.send(requestDataFrame)
        expect(dataAnswer.dataByTag(EMSTag.POWER_PV)).toBeTruthy()

        console.log(new StringFrameConverter().convert(dataAnswer))
    })


})

