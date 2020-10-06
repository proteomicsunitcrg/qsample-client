import { File } from './File';
import { WetLabFile } from './WetLabFile';

export class PlotTracePoint {

    file: WetLabFile;
    value: number;
    std: number;
    nonConformityStatus: string;

    constructor(file: WetLabFile, value: number, std: number, nonConformityStatus: string) {
        this.file = file;
        this.value = value;
        this.std = std;
        this.nonConformityStatus = nonConformityStatus;
    }
}
