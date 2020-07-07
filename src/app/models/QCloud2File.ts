import { File } from './File';
export class QCloud2File extends File {

    conformity: string

    constructor(id: number, checksum: string, creationDate: Date, filename: string, conformity: string) {
        super(id, checksum, creationDate, filename);
        this.conformity = conformity;
    }
}
