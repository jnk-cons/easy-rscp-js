import {Socket} from 'net';
import {E3dcConnectionData} from './e3dc-connection-data';

/**
 * Factory to establish a socket connection to a home power plant
 *
 * @since 0.5.1
 *
 * @interface
 * @export
 * @public
 */
export interface SocketFactory {
    /**
     * Creates a new socket connection to the home power plant specified in connectionData.
     *
     * @param connectionData Connection data of the home power plant
     *
     * @returns Socket connection to the home power plant
     *
     * @see E3dcConnectionData
     * @see Socket
     * @since 0.5.1
     * @public
     */
    createSocket(connectionData: E3dcConnectionData): Promise<Socket>
}
