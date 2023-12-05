import {
    EventType, RSCPAnswerParsedEvent,
    RSCPRequestResponseEvent,
    RSCPRequestResponseListener
} from '../../lowlevel/connection/rscp-request-response-listener';
import {StringFrameConverter} from '../converter/string-frame-converter';

export class PrintRequestAndAnswerListener implements RSCPRequestResponseListener {

    private converter = new StringFrameConverter()
    onRSCPRequestResponseEvent(event: RSCPRequestResponseEvent) {
        if (event.type == EventType.BEFORE_ENCRYPTION) {
           console.log('REQUEST --->')
           console.log(this.converter.convert(event.requestFrame))
        } else if (event.type == EventType.ANSWER_PARSED) {
            console.log('RESPONSE --->')
            const convertedEvent: RSCPAnswerParsedEvent = event as RSCPAnswerParsedEvent
            console.log(this.converter.convert(convertedEvent.parsedFrame))
        }
    }
}
