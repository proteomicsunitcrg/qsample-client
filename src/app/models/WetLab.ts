import { Plot } from './Plot';

export class WetLab {
    id: number;
    apiKey: string;
    name: string
    plot: Plot[];

    constructor(id: number, apiKey: string, name: string, plot: Plot[]) {
        this.id = id;
        this.apiKey = apiKey;
        this.name = name;
        this.plot = plot;
    }
}