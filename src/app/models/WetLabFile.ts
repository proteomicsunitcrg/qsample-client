import { File } from './File';
import { FileInfo } from './FileInfo';
import { WetLab } from './WetLab';
export class WetLabFile extends File {

  wetlab: WetLab;

  replicate: number;

  year: number;

  week: number;


  constructor(id: number, checksum: string, creationDate: Date, filename: string, wetlab: WetLab, replicate: number, year: number, week: number) {
    super(id, checksum, creationDate, filename);
    this.wetlab = wetlab;
    this.replicate = replicate;
    this.week = week;
    this.year = year;
  }
}
