import {Socket} from 'net';
import {E3dcConnectionData} from './e3dc-connection-data';

export interface SocketFactory {
    createSocket(connectionData: E3dcConnectionData): Promise<Socket>
}
