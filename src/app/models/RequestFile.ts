import { File } from './File';
import { FileInfo } from './FileInfo';
import { ModificationRelation } from './ModificationRelation';
export class RequestFile extends File {

  requestCode: string;

  fileInfo: FileInfo;

  modificationRelation: ModificationRelation[]

  constructor(id: number, checksum: string, creationDate: Date, filename: string,
    requestCode: string) {
    super(id, checksum, creationDate, filename);
    this.requestCode = requestCode;
  }
}
