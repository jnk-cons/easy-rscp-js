import {DefaultDataParser} from '../../../src/lowlevel/frame/default-data-parser';
import {BatTag} from '../../../src/api/frame/tags/BatTag';
import {DataType} from '../../../src/api/frame/DataType';
import {EMSTag} from '../../../src/api/frame/tags/EMSTag';
import {RijndaelJsAESCipher} from '../../../src/lowlevel/crypt/rijndael-js-aes-cipher';

describe('cipher test', function() {
    it('test encryption decryption', function () {
        const toTest = new RijndaelJsAESCipher('unit-test')
        const plainMessage = 'this is my cipher text'

        const plainMessageAsBuffer = Buffer.from(plainMessage)
        const encryptedMessage = toTest.encrypt(plainMessageAsBuffer)
        const decryptedMessage = toTest.decrypt(encryptedMessage)
        const slicedDecryptedMessage = Buffer.alloc(plainMessageAsBuffer.length)
        decryptedMessage.copy(slicedDecryptedMessage, 0, 0, slicedDecryptedMessage.length)
        expect(slicedDecryptedMessage.toString('hex')).toEqual(plainMessageAsBuffer.toString('hex'))
    })

})
