import {Frame} from '../frame/frame';

export interface HomePowerPlantConnection {
    connect(): Promise<void>
    disconnect(): Promise<void>
    isConnected(): boolean
    send(frame: Frame): Promise<Frame>
}
