import {AesCipherFactory} from '../../api/crypt/aes-cipher-factory';
import {AESCipher} from '../../api/crypt/aes-cipher';
import {RijndaelJsAESCipher} from './rijndael-js-aes-cipher';

export class RijndaelJsAESCipherFactory implements AesCipherFactory {
    constructor(private rscpPassword: string) {
    }
    buildCipher(): AESCipher {
        return new RijndaelJsAESCipher(this.rscpPassword);
    }

}
