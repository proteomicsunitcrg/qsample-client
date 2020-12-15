import { Instrument } from './Instrument';
import { Application } from './Application';
import { Method } from './Method';
export class InjectionCondition {

    id: number;
    application: Application;
    instrument: Instrument;
    methods: Method[];
    volume: number;

    constructor(id: number, application: Application, instrument: Instrument, methods: Method[], volume: number) {
        this.id = id;
        this.application = application;
        this.instrument = instrument;
        this.methods = methods;
        this.volume = volume;
    }
}
