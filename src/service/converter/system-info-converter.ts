import {FrameConverter} from './frame-converter';
import {Frame} from '../../api/frame/frame';
import {ProductionDate, SystemInfo} from '../../api/service/model/system-info';
import {InfoTag} from '../../api/frame/tags/InfoTag';

export class SystemInfoConverter implements FrameConverter<SystemInfo> {
    convert(frame: Frame): SystemInfo {
        const rscpValue = frame.stringByTag(InfoTag.PRODUCTION_DATE)

        const regex: RegExp = /KW(\d+) (\d+)/;
        const matchResult: RegExpMatchArray | null = rscpValue.match(regex);
        let parsedCalendarWeek = -1
        let parsedYear = -1
        if (matchResult !== null) {
            const [, cw, year]: string[] = matchResult;
            parsedCalendarWeek = parseInt(cw, 10);
            parsedYear = parseInt(year, 10);
        }

        const productionDate: ProductionDate = {
            rscpValue: rscpValue,
            calendarWeek: parsedCalendarWeek,
            year: parsedYear
        }

        return {
            serialNumber: frame.stringByTag(InfoTag.SERIAL_NUMBER),
            softwareVersion: frame.stringByTag(InfoTag.SW_RELEASE),
            productionDate: productionDate
        }
    }

}
