import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {WBTag} from '../../api/frame/tags/WBTag';

export class WallboxDeviceIdsConverter implements FrameConverter<number[]> {
    convert(frame: Frame): number[] {
        return frame
            .containerByTag(WBTag.CONNECTED_DEVICES)
            .filter(value => !value.isErrorResponse())
            .map(value => value.valueAsNumber() )
    }
}
