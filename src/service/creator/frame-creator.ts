import {Frame} from '../../api/frame/frame';

export interface FrameCreator<S> {
    create(input: S): Frame
}
