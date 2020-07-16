import { RequestStatus } from './RequestStatus';

export class MiniRequest {
    id: number;
    creationDate: string;
    creatorMail: string;
    status: RequestStatus;
    type: string

    constructor(id: number, creationDate: string, creatorMail: string, status: RequestStatus, type: string) {
        this.id = id;
        this.creationDate = creationDate;
        this.creatorMail = creatorMail;
        this.status = status;
        this.type = type;
    }
}