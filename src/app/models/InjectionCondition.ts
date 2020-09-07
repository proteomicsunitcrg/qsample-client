import { Instrument } from './Instrument';
import { Application } from './Application';
export class InjectionCondition {

    id: number;
    application: Application
    instrument: Instrument;
    method: string;
    volume: number;

    constructor(id: number, application: Application, instrument: Instrument, method: string, volume: number) {
        this.id = id;
        this.application = application;
        this.instrument = instrument;
        this.method = method;
        this.volume = volume;
    }
}
