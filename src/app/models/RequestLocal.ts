import { Application } from './Application';

export class RequestLocal {
    id: number;
    requestCode: number;
    application: Application;
    creationDate: Date;
    status: string;
    group: string;
    creator: string;
    samples: string;
    taxonomy: string;

    constructor() {
        
    }
}