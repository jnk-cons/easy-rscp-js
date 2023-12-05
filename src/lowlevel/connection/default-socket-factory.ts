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
            newSocket.on('error', errorListener)
            newSocket.connect({
                port: connectionData.port,
                host: connectionData.address,
                keepAlive: true
            }, () => {
                newSocket.removeListener('error', errorListener)
                resolve(newSocket)
            })
        })
    }

}
