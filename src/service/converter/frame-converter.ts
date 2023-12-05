import {Frame} from '../../api/frame/frame';

export interface FrameConverter<R> {
    convert(frame: Frame): R
}

export interface RequestResponseFrameConverter<R> {
    convert(request: Frame, response: Frame): R
}
