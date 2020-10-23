import { RequestStatus } from './RequestStatus';

export class MiniRequest {
    id: number;
    creationDate: string;
    creatorMail: string;
    creatorName: string;
    status: RequestStatus;
    type: string;
    lastField: string;

    constructor(id: number, creationDate: string, creatorMail: string, creatorName: string,
                status: RequestStatus, type: string, lastField: string) {
        this.id = id;
        this.creationDate = creationDate;
        this.creatorMail = creatorMail;
        this.creatorName = creatorName;
        this.status = status;
        this.type = type;
        this.lastField = lastField;
    }
}
