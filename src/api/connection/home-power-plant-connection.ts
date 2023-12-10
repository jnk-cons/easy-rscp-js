import {Frame} from '../frame/frame';

/**
 * Connection to the home power plant. Provides the ability to send and receive frames.
 *
 * @since 0.5.1
 *
 * @interface
 * @export
 * @public
 */
export interface HomePowerPlantConnection {
    /**
     * Establishes the connection to the home power plant. If a connection already exists, this is a no-op.
     *
     * @returns Promise without value. If success was called, the connection was established successfully
     *
     * @since 0.5.1
     * @public
     */
    connect(): Promise<void>

    /**
     * Closes the connection to the home power plant. If there is no connection, this is a no-op.
     *
     * @returns Promise without value. If success was called, the connection was disconnected successfully
     *
     * @since 0.5.1
     * @public
     */
    disconnect(): Promise<void>

    /**
     * Checks if there is a connection
     *
     * @returns true, if the connection exists, otherwise false
     *
     * @since 0.5.1
     * @public
     */
    isConnected(): boolean

    /**
     * Sends a frame to the home power plant and returns the response
     *
     * @param frame The frame to send
     *
     * @returns Promise with the response frame of the home power plant
     *
     * @see Frame
     * @since 0.5.1
     * @public
     */
    send(frame: Frame): Promise<Frame>
}
