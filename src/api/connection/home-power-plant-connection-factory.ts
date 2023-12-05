import {HomePowerPlantConnection} from './home-power-plant-connection';

export interface HomePowerPlantConnectionFactory {
    openConnection(): Promise<HomePowerPlantConnection>
}
