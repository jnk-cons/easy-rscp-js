import {HomePowerPlantConnectionFactory} from '../../api/connection/home-power-plant-connection-factory';
import {HomePowerPlantConnection} from '../../api/connection/home-power-plant-connection';
import {E3dcConnectionData} from '../../api/connection/e3dc-connection-data';
import {AesCipherFactory} from '../../api/crypt/aes-cipher-factory';
import {RijndaelJsAESCipherFactory} from '../crypt/rijndael-js-aes-cipher-factory';
import {SocketFactory} from '../../api/connection/socket-factory';
import {DefaultSocketFactory} from './default-socket-factory';
import {FrameParser} from '../../api/frame/frame-parser';
import {DefaultFrameParser} from '../frame/default-frame-parser';
import {DefaultHomePowerPlantConnection} from './default-home-power-plant-connection';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../frame/frame-builder';
import {DataBuilder} from '../frame/data-builder';
import {RSCPTag} from '../../api/frame/tags/RSCPTag';
import {RSCPRequestResponseListener} from './rscp-request-response-listener';

export class DefaultHomePowerPlantConnectionFactory implements HomePowerPlantConnectionFactory {

    constructor(
        private connectionData: E3dcConnectionData,
        private aesFactory: AesCipherFactory = new RijndaelJsAESCipherFactory(connectionData.rscpPassword),
        private socketFactory: SocketFactory = new DefaultSocketFactory(),
        private frameParser: FrameParser = new DefaultFrameParser(),
        private listener: RSCPRequestResponseListener[] = []) {

    }

    openConnection(): Promise<HomePowerPlantConnection> {
        return new Promise<HomePowerPlantConnection>((resolve, reject) => {
            const connection = new DefaultHomePowerPlantConnection(
                this.connectionData, this.aesFactory, this.socketFactory, this.frameParser, this.listener
            )
            connection
                .connect()
                .then(() => {
                    const authFrame = this.buildAuthenticationFrame()
                    connection
                        .send(authFrame)
                        .then(response => {
                            const authLevel =response.numberByTag(RSCPTag.AUTHENTICATION)
                            if (authLevel == 0) {
                                connection.disconnect().then()
                                reject(new Error('Authentication failed'))
                            }
                            else {
                                resolve(connection)
                            }
                        })
                        .catch(e => {
                            connection.disconnect().then()
                            reject(e)
                        })
                })
                .catch(e => reject(e))
        });
    }

    private buildAuthenticationFrame(): Frame {
        return new FrameBuilder()
            .addData(
                new DataBuilder().tag(RSCPTag.REQ_AUTHENTICATION).container(
                    new DataBuilder().tag(RSCPTag.AUTHENTICATION_USER).string(this.connectionData.portalUser).build(),
                    new DataBuilder().tag(RSCPTag.AUTHENTICATION_PASSWORD).string(this.connectionData.portalPassword).build()
                ).build()
            )
            .build()
    }

}
