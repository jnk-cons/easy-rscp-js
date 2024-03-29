import {HomePowerPlantConnection} from '../../api/connection/home-power-plant-connection';
import {Frame} from '../../api/frame/frame';
import {E3dcConnectionData} from '../../api/connection/e3dc-connection-data';
import {AesCipherFactory} from '../../api/crypt/aes-cipher-factory';
import {SocketFactory} from '../../api/connection/socket-factory';
import {FrameParser} from '../../api/frame/frame-parser';
import {DefaultFrameParser} from '../frame/default-frame-parser';
import {DefaultSocketFactory} from './default-socket-factory';
import {Socket} from 'net';
import {AESCipher} from '../../api/crypt/aes-cipher';
import {
    RSCPAfterRequestSendEvent, RSCPAnswerDecryptedEvent, RSCPAnswerParsedEvent, RSCPAnswerReceivedEvent,
    RSCPBeforeRequestEncryptionEvent, RSCPBeforeRequestSendEvent,
    RSCPRequestResponseEvent,
    RSCPRequestResponseListener
} from './rscp-request-response-listener';

export class DefaultHomePowerPlantConnection implements HomePowerPlantConnection {

    private socket: Socket | undefined
    private aes: AESCipher
    private queue: FrameSender[] = []
    private currentSender: FrameSender | undefined
    constructor(
        private connectionData: E3dcConnectionData,
        private aesFactory: AesCipherFactory,
        private socketFactory: SocketFactory = new DefaultSocketFactory(),
        private parser: FrameParser = new DefaultFrameParser(),
        private listener: RSCPRequestResponseListener[] = []) {

        this.aes = this.aesFactory.buildCipher()
    }


    connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.isConnected()) {
                resolve()
            }
            else {
                this.socketFactory
                    .createSocket(this.connectionData)
                    .then((newSocket) => {
                        this.socket = newSocket
                        this.socket.on('data', (data: Buffer) => {
                            this.onDataReceivedFromSocket(data)
                        });
                        this.socket.on('error', (e: any) => {
                            this.onErrorReceivedFromSocket(e)
                        });
                        resolve()
                    })
                    .catch((e) => {
                        reject(e)
                    })
            }
        })
    }

    disconnect(e: Error | undefined = undefined, force: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const error = e ?? { name: 'DISCONNECT', message: 'Disconnect requested'}
            if (this.isConnected()) {
                if (this.socket) {
                    if (force) {
                        this.socket?.destroy()
                        this.socket = undefined
                        this.resetQueue(error)
                        resolve()
                    }
                    this.socket?.end(() => {
                        this.socket?.destroy()
                        this.socket = undefined
                        this.resetQueue(error)
                        resolve()
                    })
                }
                else {
                    this.resetQueue(error)
                    resolve()
                }
            }
            else {
                this.resetQueue(error)
                resolve()
            }
        })
    }

    isConnected(): boolean {
        return this.socket != undefined;
    }

    private resetQueue(e: Error) {
        this.queue.forEach(value => value.reject(e))
        this.queue = []
        this.currentSender = undefined
    }


    private onDataReceivedFromSocket(data: Buffer) {
        if (this.currentSender) {
            if (this.currentSender.timeoutId) {
                clearTimeout(this.currentSender.timeoutId)
            }
            const answerReceivedEvent = new RSCPAnswerReceivedEvent(
                this.currentSender.requestFrame,
                data.toString('hex')
            )
            this.notifyListener(answerReceivedEvent)
            const decryptedBuffer = this.aes.decrypt(data)
            const answerDecryptedEvent = new RSCPAnswerDecryptedEvent(
                this.currentSender.requestFrame,
                decryptedBuffer.toString('hex')
            )
            this.notifyListener(answerDecryptedEvent)
            const responseFrame = this.parser.parseFrame(decryptedBuffer.toString('hex'))
            const frameParsedEvent = new RSCPAnswerParsedEvent(
                this.currentSender.requestFrame,
                responseFrame
            )
            this.notifyListener(frameParsedEvent)
            this.currentSender.resolve(responseFrame)
            this.currentSender = undefined
        }
        this.processQueue()
    }

    private onErrorReceivedFromSocket(error: any) {
        if (this.currentSender) {
            if (this.currentSender.timeoutId) {
                clearTimeout(this.currentSender.timeoutId)
            }
            this.currentSender.reject(error)
            this.currentSender = undefined
        }
        this.processQueue()
    }

    private processQueue() {
        if (this.queue.length >= 1 && this.currentSender === undefined) {
            this.currentSender = this.queue.pop()
            if (this.currentSender) {
                const timeout = this.connectionData.readTimeoutMillis ?? 10000
                const timeoutId = setTimeout(() => {
                    const error = {
                        name: 'READ_TIMEOUT',
                        message: 'No response from the home power station (' + this.connectionData.address + ':' + this.connectionData.port + ') within ' + timeout + 'ms received.'
                    }
                    this.currentSender?.reject(error)
                    this.disconnect(error, true)
                        .then()

                }, timeout)
                this.currentSender?.sendRequest(timeoutId)
            }
        }
    }

    send(frame: Frame): Promise<Frame> {
        return new Promise<Frame>((resolve, reject) => {
            if (this.isConnected()) {
                const handler = new FrameSender(frame, this.socket!!, this.aes, resolve, reject, this)
                this.queue.push(handler)
                this.processQueue()
            } else {
                this.connect()
                    .then(() => {
                        const handler = new FrameSender(frame, this.socket!!, this.aes, resolve, reject, this)
                        this.queue.push(handler)
                        this.processQueue()
                    })
                    .catch(e => {
                        reject(e);
                    })
            }
        })
    }

    notifyListener(event: RSCPRequestResponseEvent) {
        this.listener.forEach(current => current.onRSCPRequestResponseEvent(event))
    }
}

class FrameSender {

    timeoutId: NodeJS.Timeout | undefined

    constructor(
        public requestFrame: Frame,
        public socket: Socket,
        public aes: AESCipher,
        public resolve: ((value: Frame | PromiseLike<Frame>) => void),
        public reject: ((reason?: any) => void),
        public connection: DefaultHomePowerPlantConnection) {
    }

    private encrypt(): Buffer {
        const beforeEncryptionEvent = new RSCPBeforeRequestEncryptionEvent(
            this.requestFrame
        )
        this.connection.notifyListener(beforeEncryptionEvent)
        let frameBuffer = Buffer.from(this.requestFrame.asRSCPFormattedHexString(), 'hex')
        frameBuffer = this.aes.encrypt(frameBuffer)
        const afterEncryptionEvent = new RSCPBeforeRequestSendEvent(
            this.requestFrame,
            frameBuffer.toString('hex')
        )
        this.connection.notifyListener(afterEncryptionEvent)
        return frameBuffer
    }

    public sendRequest(timeoutId: NodeJS.Timeout): boolean  {
        this.timeoutId = timeoutId
        const frameBuffer = this.encrypt()
        const result = this.socket.write(frameBuffer)
        const afterSendEvent = new RSCPAfterRequestSendEvent(
            this.requestFrame,
            frameBuffer.toString('hex')
        )
        this.connection.notifyListener(afterSendEvent)
        return result
    }
}
