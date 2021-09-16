export class WorkflowParsed {

  duration: number;
  filename: string;
  database: string;
  status: string;

  constructor(duration: number, filename: string, database: string, status: string) {
    this.duration = duration;
    this.filename = filename;
    this.database = database;
    this.status = status;
  }
}
