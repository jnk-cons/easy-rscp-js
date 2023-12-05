import {SystemInfo} from './model/system-info';

export interface InfoService {
    readSystemInfo(): Promise<SystemInfo>
}
