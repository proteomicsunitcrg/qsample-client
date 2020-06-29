export class ThresholdForPlot {
    direction: string;
    initialValue: number;
    stepValue: number;
    steps: number;

    constructor(direction: string, initialValue: number, stepValue: number, steps: number) {
        this.direction = direction;
        this.initialValue = initialValue;
        this.stepValue = stepValue;
        this.steps = steps;
    }
}