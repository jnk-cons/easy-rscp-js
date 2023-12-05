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

describe('home power plant integration connection tests', function() {
    const connectionData: E3dcConnectionData = {
        address: process.env['RSCP_IP']!!,
        portalUser: process.env['PORTAL_USER']!!,
        portalPassword: process.env['PORTAL_PASSWORD']!!,
        rscpPassword: process.env['RSCP_PASSWORD']!!,
        port: 5033
    }

    const aesFactory = new RijndaelJsAESCipherFactory(connectionData.rscpPassword)

    it('authentication test', async function () {
        const connection = new DefaultHomePowerPlantConnection(
            connectionData,
            aesFactory
        )
        const authenticationFrame = new FrameBuilder()
            .enableChecksum()
            .addData(
                new DataBuilder()
                    .tag(RSCPTag.REQ_AUTHENTICATION)
                    .container(
                        new DataBuilder().tag(RSCPTag.AUTHENTICATION_USER).string(connectionData.portalUser).build(),
                        new DataBuilder().tag(RSCPTag.AUTHENTICATION_PASSWORD).string(connectionData.portalPassword).build(),
                    )
                    .build()
            )
            .build()

        await connection.connect()
        const authAnswer = await connection.send(authenticationFrame)
        const authAnswerBlock = authAnswer.dataByTag(RSCPTag.AUTHENTICATION)
        expect(authAnswerBlock).toBeTruthy()
        const permissions = authAnswerBlock!!.valueAsNumber()
        expect(permissions).toBe(10)

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
    })


})

