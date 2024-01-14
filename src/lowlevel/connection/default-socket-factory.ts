import {SocketFactory} from '../../api/connection/socket-factory';
import {Socket} from 'net';
import {E3dcConnectionData} from '../../api/connection/e3dc-connection-data';

export class DefaultSocketFactory implements SocketFactory {
    createSocket(connectionData: E3dcConnectionData): Promise<Socket> {
        return new Promise<Socket>((resolve, reject) => {
            const newSocket = new Socket()
            const errorListener = (e: Error) => {
                newSocket.removeListener('error', errorListener)
                reject(e)
            }
            const connectionTimout = connectionData.connectionTimeoutMillis ?? 5000
            const timeoutId = setTimeout(() => {
                newSocket.destroy({
                    name: 'CONNECTION_TIMEOUT',
                    message: 'Unable to establish an connection to '
                        + connectionData.address + ':' + connectionData.port
                        + ' within the configured timeout of '
                        + connectionTimout + 'ms'
                })
            }, connectionTimout)
            newSocket.on('error', errorListener)
            newSocket.connect({
                port: connectionData.port,
                host: connectionData.address,
                keepAlive: true
            }, () => {
                clearTimeout(timeoutId)
                newSocket.removeListener('error', errorListener)
                resolve(newSocket)
            })
        })
    }

}
