export class WorkflowParsed {

  duration: Date;
  filename: string;
  database: string;
  status: string;

  constructor(duration: Date, filename: string, database: string, status: string) {
    this.duration = duration;
    this.filename = filename;
    this.database = database;
    this.status = status;
  }
}
