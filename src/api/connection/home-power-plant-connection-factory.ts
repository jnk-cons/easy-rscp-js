import {HomePowerPlantConnection} from './home-power-plant-connection';

/**
 * Factory to establish connections to a home power plant
 *
 * @since 0.5.1
 *
 * @interface
 * @export
 * @public
 */
export interface HomePowerPlantConnectionFactory {

    /**
     * Opens a connection to a home power plant. The connection that is supplied is already connected and authenticated.
     *
     * @returns Open and authenticated connection to the home power plant
     *
     * @since 0.5.1
     * @public
     */
    openConnection(): Promise<HomePowerPlantConnection>
}
