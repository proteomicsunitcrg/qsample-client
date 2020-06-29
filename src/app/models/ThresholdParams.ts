import { ContextSource } from './ContextSource';
export class ThresholdParams {
    thresholdParamsId: { thresholdId: number, contextSourceId: number };
    contextSource: ContextSource;
    enabled: boolean;
    initialValue: number;
    stepValue: number;

    constructor(thresholdParamsId: { thresholdId: number, contextSourceId: number }, contextSource: ContextSource, enabled: boolean, initialValue: number, stepValue: number){
        this.thresholdParamsId = thresholdParamsId;
        this.contextSource = contextSource;
        this.enabled = enabled;
        this.initialValue = initialValue;
        this.stepValue = stepValue;
    }
}