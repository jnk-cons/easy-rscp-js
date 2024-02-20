import {WallboxPowerState} from './model/wallbox-power-state';
import {WallboxInfo} from './model/wallbox-info';

export interface WallboxService {
    readConnectedWallboxes(): Promise<WallboxInfo[]>
    readPowerState(ids: number[]): Promise<WallboxPowerState[]>
}
