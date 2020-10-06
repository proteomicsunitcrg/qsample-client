import { File } from './File';
import { WetLab } from './WetLab';
export class WetLabFile extends File {

    wetlab: WetLab;


    constructor(id: number, checksum: string, creationDate: Date, filename: string, wetlab: WetLab) {
        super(id, checksum, creationDate, filename);
        this.wetlab = wetlab;
    }
}
