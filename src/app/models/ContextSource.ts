import { TraceColor } from './TraceColor';
export class ContextSource {

    id: number;
    apiKey: string;
    abbreviated: string;
    name: string;
    charge: number;
    mz: number;
    traceColor: TraceColor

    constructor(id: number, apiKey: string, abbreviated: string, name: string, charge: number, mz: number, traceColor: TraceColor) {
        this.id = id;
        this.apiKey = apiKey;
        this.abbreviated = abbreviated;
        this.name = name;
        this.charge = charge;
        this.mz = mz;
        this.traceColor = traceColor;
    }
}