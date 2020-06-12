import { File } from './File';
export class Guideset {
    id: number;
    apiKey: string;
    files: File[]

    constructor(id: number, apiKey: string, files: File[]) {
        this.id = id;
        this.apiKey = apiKey;
        this.files = files;
    }
}