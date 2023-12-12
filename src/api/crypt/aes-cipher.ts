/**
 * Service to encrypt or decrypt a given byte message using AES.
 *
 * The service is stateful and designed for E3DC home power plants and follows the algorithm required there.
 * For example, the last block of the last encrypted message is used as IV for the next one.
 *
 * @since 0.5.1
 *
 * @interface
 * @export
 * @public
 */
export interface AESCipher {
    /**
     * Encrypts the given message using AES
     *
     * @param message Unencrypted message to be encrypted
     * @returns Encrypted message
     *
     * @since 0.5.1
     *
     * @public
     */
    encrypt(message: Buffer): Buffer

    /**
     * Decrypts the given message using AES
     *
     * @param message Encrypted message to be decrypted
     * @returns Decrypted message
     *
     * @since 0.5.1
     *
     * @public
     */
    decrypt(message: Buffer): Buffer
}
