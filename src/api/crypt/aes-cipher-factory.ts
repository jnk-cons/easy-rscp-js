import {AESCipher} from './aes-cipher';

export interface AesCipherFactory {
    buildCipher(): AESCipher
}
