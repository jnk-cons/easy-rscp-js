import {FrameCreator} from './frame-creator';
import {Frame} from '../../api/frame/frame';
import {FrameBuilder} from '../../lowlevel/frame/frame-builder';
import {DataBuilder} from '../../lowlevel/frame/data-builder';
import {WBTag} from '../../api/frame/tags/WBTag';

export class RequestWallboxLiveDataCreator implements FrameCreator<number[]> {
    create(input: number[]): Frame {
        const content = input.map(value => {
            return new DataBuilder().tag(WBTag.REQ_DATA).container(
                new DataBuilder().tag(WBTag.INDEX).uchar8(value).build(),
                new DataBuilder().tag(WBTag.REQ_EXTERN_DATA_SUN).build(),
                new DataBuilder().tag(WBTag.REQ_EXTERN_DATA_ALL).build(),
            ).build()
        })

        return new FrameBuilder()
            .addData(...content)
            .build();
    }

}
