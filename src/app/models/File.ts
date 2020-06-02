import { WetLab } from './WetLab';
export class File {

    id: number;
    checksum: string;
    creationDate: Date;
    filename: string;
    wetlab: WetLab

    constructor(id: number, checksum: string, creationDate: Date, filename: string, wetlab: WetLab) {
        this.id = id;
        this.checksum = checksum;
        this.creationDate = creationDate;
        this.filename = filename;
        this.wetlab = wetlab;
    }
}
