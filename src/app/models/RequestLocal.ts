import { Application } from './Application';

export class RequestLocal {
    id: number;
    requestCode: string;
    application: Application;
    creation_date: Date;
    status: string;
    group: string;
    creator: string;
    samples: string;
    taxonomy: string;

    constructor() {

    }
}
