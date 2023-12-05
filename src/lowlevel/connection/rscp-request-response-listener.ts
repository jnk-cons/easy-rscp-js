import {Frame} from '../../api/frame/frame';

export interface RSCPRequestResponseListener {
    onRSCPRequestResponseEvent(event: RSCPRequestResponseEvent): void
}

export enum EventType {
    BEFORE_ENCRYPTION,
    BEFORE_SENT,
    AFTER_SENT,
    ANSWER_RECEIVED,
    ANSWER_DECRYPTED,
    ANSWER_PARSED
}

export class RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame, public type: EventType) {
    }

}

export class RSCPBeforeRequestEncryptionEvent extends RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame) {
        super(requestFrame, EventType.BEFORE_ENCRYPTION)
    }
}

export class RSCPBeforeRequestSendEvent extends RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame, public encryptedFrame: string) {
        super(requestFrame, EventType.BEFORE_SENT)
    }

}

export class RSCPAfterRequestSendEvent extends RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame, public sentData: string) {
        super(requestFrame, EventType.AFTER_SENT)
    }
}

export class RSCPAnswerReceivedEvent extends RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame, public encryptedAnswer: string) {
        super(requestFrame, EventType.ANSWER_RECEIVED)
    }
}

export class RSCPAnswerDecryptedEvent extends RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame, public decryptedAnswer: string) {
        super(requestFrame, EventType.ANSWER_DECRYPTED)
    }
}

export class RSCPAnswerParsedEvent extends RSCPRequestResponseEvent {
    constructor(public requestFrame: Frame, public parsedFrame: Frame) {
        super(requestFrame, EventType.ANSWER_PARSED)
    }
}



