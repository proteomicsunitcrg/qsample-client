import { Instrument } from './Instrument';
export class InjectionConditionQC {

    id: number;
    qctype: string;
    instrument: Instrument;
    method: string;
    volume: number;

    constructor(id: number, qctype: string, instrument: Instrument, method: string, volume: number) {
        this.id = id;
        this.qctype = qctype;
        this.instrument = instrument;
        this.method = method;
        this.volume = volume;
    }
}
