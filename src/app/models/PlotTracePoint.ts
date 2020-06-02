import { File } from './file';

export class PlotTracePoint {

    file: File;
    value: number;
    nonConformityStatus: string;

    constructor(file: File, value: number, nonConformityStatus: string) {
        this.file = file;
        this.value = value;
        this.nonConformityStatus = nonConformityStatus;
    }
}
