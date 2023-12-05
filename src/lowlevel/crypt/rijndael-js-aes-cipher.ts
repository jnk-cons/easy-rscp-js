import {AESCipher} from '../../api/crypt/aes-cipher';
import RijndaelBlock from 'rijndael-js';


export class RijndaelJsAESCipher implements AESCipher{

    private BLOCK_SIZE_BYTES = 32
    private BLOCK_SIZE_BITS = this.BLOCK_SIZE_BYTES * 8
    private aes: RijndaelBlock
    private encryptionIV = Buffer.alloc(this.BLOCK_SIZE_BYTES, 0xFF)
    private decryptionIV = Buffer.alloc(this.BLOCK_SIZE_BYTES, 0xFF)
    constructor(rscpPassword: string) {
        const key = Buffer.alloc(this.BLOCK_SIZE_BYTES, 0xFF)
        const passwordBuffer = Buffer.from(rscpPassword)
        passwordBuffer.copy(key,0, 0, Math.min(32, passwordBuffer.length))
        this.aes = new RijndaelBlock(key, 'cbc')
    }

    encrypt(message: Buffer): Buffer {
        const encryptedMessage = Buffer.from( this.aes.encrypt(message, this.BLOCK_SIZE_BITS.toString(), this.encryptionIV) )
        encryptedMessage.copy(this.encryptionIV, 0, encryptedMessage.length - this.BLOCK_SIZE_BYTES)
        return encryptedMessage
    }

    decrypt(message: Buffer): Buffer {
        const decryptedMessage = Buffer.from( this.aes.decrypt(message, this.BLOCK_SIZE_BITS.toString(), this.decryptionIV) )
        message.copy(this.decryptionIV, 0, decryptedMessage.length - this.BLOCK_SIZE_BYTES)
        return decryptedMessage;
    }
}
