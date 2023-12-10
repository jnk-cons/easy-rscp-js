/**
 * Simple structure to provide the connection data to the home power plant
 *
 *
 * @property address IP address or DNS name of the home power plant
 * @property port Port on which the power plant listens. Default: 5033 (Info: 5034 for Farming)
 * @property portalUser Username. Corresponds to the username from the E3DC portal
 * @property portalPassword Password. Corresponds to the password on the E3DC portal
 * @property rscpPassword Encryption password. This value is configured directly at the home power plant and must be identical here.
 *
 * @since 0.5.1
 *
 * @interface
 * @export
 * @public
 */
export interface E3dcConnectionData {
    address: string,
    port: number,
    portalUser: string,
    portalPassword: string,
    rscpPassword: string
}
