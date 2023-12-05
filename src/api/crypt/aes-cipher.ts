export interface AESCipher {
    encrypt(message: Buffer): Buffer

    decrypt(message: Buffer): Buffer
}
