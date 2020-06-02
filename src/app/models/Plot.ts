import { Param } from './Param';
import { ContextSource } from './ContextSource';

export class Plot {

    id: number;
    apiKey: string;
    contextSource: ContextSource[];
    param: Param;
    name: string;

    constructor(id: number, apiKey: string, contextSource: ContextSource[], param: Param, name: string) {
        this.id = id;
        this.apiKey = apiKey;
        this.contextSource = contextSource;
        this.param = param;
        this.name = name;
    }
}