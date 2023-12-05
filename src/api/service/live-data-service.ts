import {PowerState} from './model/power-state';

export interface LiveDataService {
    readPowerState(): Promise<PowerState>
}
