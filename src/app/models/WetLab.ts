import { Plot } from './Plot';
import { Guideset } from './Guideset';

export class WetLab {
    id: number;
    apiKey: string;
    name: string
    plot: Plot[];
    guideset: Guideset;

    constructor(id: number, apiKey: string, name: string, plot: Plot[]) {
        this.id = id;
        this.apiKey = apiKey;
        this.name = name;
        this.plot = plot;
    }
}