import { File } from './file';

export class PlotTracePoint {

    file: File;
    value: number;
    std: number;
    nonConformityStatus: string;

    constructor(file: File, value: number, std: number,nonConformityStatus: string) {
        this.file = file;
        this.value = value;
        this.std = std;
        this.nonConformityStatus = nonConformityStatus;
    }
}
