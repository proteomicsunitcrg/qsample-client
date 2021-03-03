import { File } from './File';
import { WetLabFile } from './WetLabFile';
export class Guideset {
  id: number;
  apiKey: string;
  files: WetLabFile[];

  constructor(id: number, apiKey: string, files: WetLabFile[]) {
    this.id = id;
    this.apiKey = apiKey;
    this.files = files;
  }
}
