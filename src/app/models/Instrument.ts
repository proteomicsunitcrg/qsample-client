export class Instrument {
  id: number;
  name: string;
  path: string;
  method: string;

  constructor(id: number, name: string, path: string, method: string) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.method = this.method;
  }
}
