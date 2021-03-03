import { WetLab } from './WetLab';
export class File {

  id: number;
  checksum: string;
  creationDate: Date;
  filename: string;

  constructor(id: number, checksum: string, creationDate: Date, filename: string) {
    this.id = id;
    this.checksum = checksum;
    this.creationDate = creationDate;
    this.filename = filename;
  }
}
