import {AESCipher} from './aes-cipher';

/**
 * Factory to create AESCipher instances
 *
 * @since 0.5.1
 *
 * @see AESCipher
 *
 * @public
 * @interface
 * @export
 */
export interface AesCipherFactory {

    /**
     * Creates a new instance.
     *
     * According to the E3DC requirements, an array of zeros is (unfortunately) used as IV here.
     *
     * @returns Newly created instance
     *
     * @since 0.5.1
     *
     * @see AESCipher
     *
     * @public
     */
    buildCipher(): AESCipher
}
