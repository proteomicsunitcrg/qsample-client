import { File } from './File';
export class RequestFile extends File {

  requestCode: string;

  constructor(id: number, checksum: string, creationDate: Date, filename: string,
    requestCode: string) {
    super(id, checksum, creationDate, filename);
    this.requestCode = requestCode;
  }
}
