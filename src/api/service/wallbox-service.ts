import {WallboxPowerState} from './model/wallbox-power-state';

export interface WallboxService {
    readConnectedWallboxes(): Promise<WallboxInfo[]>
    readPowerState(ids: number[]): Promise<WallboxPowerState[]>
}
