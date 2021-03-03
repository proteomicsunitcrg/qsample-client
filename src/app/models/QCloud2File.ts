import { File } from './File';
export class QCloud2File extends File {

  conformity: string;
  ls: string;
  conformityError: string;
  lsApiKey: string;

  constructor(id: number, checksum: string, creationDate: Date, filename: string,
    conformity: string, ls: string, conformityError: string, lsApiKey: string) {
    super(id, checksum, creationDate, filename);
    this.conformity = conformity;
    this.ls = ls;
    this.conformityError = conformityError;
    this.lsApiKey = lsApiKey;
  }
}
