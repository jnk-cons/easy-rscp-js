import {Frame} from './frame';

export interface FrameParser {
    parseFrame(valueAsHex: string): Frame
}
