export type ProcessingStatus = 'RECEIVED' | 'PROCESSING' | 'PROCESSED' | 'ERROR';

export class RequestFileStatus {

  checksum: string;
  status: ProcessingStatus;
  receivedDate: Date;
  processingStartedDate: Date;
  updatedDate: Date;
  databaseName: string;
  databaseStatus: string;
  sizeMb: number;
  rawSummary: string;
  processName: string;
  errorReason: string;

}
