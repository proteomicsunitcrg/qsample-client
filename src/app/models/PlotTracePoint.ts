import { File } from './File';
import { WetLabFile } from './WetLabFile';

export class PlotTracePoint {

    file: any;
    value: number;
    std: number;
    nonConformityStatus: string;

    constructor(file: any, value: number, std: number, nonConformityStatus: string) {
        this.file = file;
        this.value = value;
        this.std = std;
        this.nonConformityStatus = nonConformityStatus;
    }
}
