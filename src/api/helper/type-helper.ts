import {DataType} from '../frame/DataType';
import {RSCPTag} from '../frame/tags/RSCPTag';
import {EMSTag} from '../frame/tags/EMSTag';
import {PVITag} from '../frame/tags/PVITag';
import {BatTag} from '../frame/tags/BatTag';
import {DCDCTag} from '../frame/tags/DCDCTag';
import {PMTag} from '../frame/tags/PMTag';
import {DBTag} from '../frame/tags/DBTag';
import {SRVTag} from '../frame/tags/SRVTag';
import {HATag} from '../frame/tags/HATag';
import {InfoTag} from '../frame/tags/InfoTag';
import {EPTag} from '../frame/tags/EPTag';
import {SYSTag} from '../frame/tags/SYSTag';
import {UMTag} from '../frame/tags/UMTag';
import {WBTag} from '../frame/tags/WBTag';
import {Namespace} from '../frame/tags/Namespace';

export function determineDataTypeName(typeAsHex: string): string {
    for (const [key, value] of Object.entries(DataType)) {
        if (value === typeAsHex) {
            return key
        }
    }
    return 'UNKNOWN'
}

const namespaceToEnum = {
    '00': RSCPTag,
    '01': EMSTag,
    '02': PVITag,
    '03': BatTag,
    '04': DCDCTag,
    '05': PMTag,
    '06': DBTag,
    '07': null,
    '08': SRVTag,
    '09': HATag,
    '0A': InfoTag,
    '0B': EPTag,
    '0C': SYSTag,
    '0D': UMTag,
    '0E': WBTag,
}

export function determineNamespaceName(tagAsHex: string): string {
    const namespace = tagAsHex.substring(0, 2)
    for (const [key, value] of Object.entries(Namespace)) {
        if (value === namespace) {
            return key
        }
    }
    return 'UNKNOWN'
}

export function determineTagName(tagAsHex: string): string {
    const namespace = tagAsHex.substring(0, 2)
    // @ts-ignore
    const targetEnum = namespaceToEnum[namespace]
    if (targetEnum) {
        for (const [key, value] of Object.entries(targetEnum)) {
            if (value === tagAsHex) {
                return key
            }
        }
    }
    return 'UNKNOWN'
}

export function tag2ReadableString(tagAsHex: string): string {
    return determineTagName(tagAsHex) + ' (' + tagAsHex + ')'
}
