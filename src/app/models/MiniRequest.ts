import { RequestStatus } from './RequestStatus';

export class MiniRequest {
  id: number;
  creationDate: string;
  creatorMail: string;
  creatorName: string;
  status: RequestStatus;
  type: string;
  lastField: string;
  hasData: boolean;
  local: boolean

  constructor(id: number, creationDate: string, creatorMail: string, creatorName: string,
    status: RequestStatus, type: string, lastField: string, hasData: boolean, local: boolean) {
    this.id = id;
    this.creationDate = creationDate;
    this.creatorMail = creatorMail;
    this.creatorName = creatorName;
    this.status = status;
    this.type = type;
    this.lastField = lastField;
    this.hasData = hasData;
    this.local = local;
  }
}
