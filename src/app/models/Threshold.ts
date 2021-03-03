import { WetLab } from './WetLab';
import { Param } from './Param';
import { ThresholdParams } from './ThresholdParams';
export class Threshold {
  id: number;
  apiKey: string;
  wetlab: WetLab;
  nonConformityDirection: string;
  param: Param;
  steps: number;
  thresholdParams: ThresholdParams[];

  constructor(id: number, apiKey: string, wetLab: WetLab,
    nonConformityDirection: string, param: Param, steps: number, thresholdParams: ThresholdParams[]) {
    this.id = id;
    this.apiKey = apiKey;
    this.wetlab = wetLab;
    this.nonConformityDirection = nonConformityDirection;
    this.param = param;
    this.steps = steps;
    this.thresholdParams = thresholdParams;
  }
}
