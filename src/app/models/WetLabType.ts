export class WetLabType {
    id: number;
    apiKey: string;
    name: string
    plot: any;

    constructor(id: number, apiKey: string, name: string) {
        this.id = id;
        this.apiKey = apiKey;
        this.name = name;
    }
}