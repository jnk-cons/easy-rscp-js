import {Data} from './data';

export interface DataParser {
    parseRSCPData(valueAsHex: string): Data[]
}
