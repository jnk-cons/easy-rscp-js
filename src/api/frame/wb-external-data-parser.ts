import {Data} from './data';
import {WbExternalEnergyData} from './wb-external-energy-data';

export interface WbExternalDataParser {
    parseEnergyData(block: Data): WbExternalEnergyData
}
