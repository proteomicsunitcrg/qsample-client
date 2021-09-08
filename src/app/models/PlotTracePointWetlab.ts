import { File } from './File';
import { WetLabFile } from './WetLabFile';

export class PlotTracePointWetlab {
  name: string;
  value: number;
  std: number;
  week: number;
  year: number;
  triplicats: WetLabFile[];


  constructor(name: string, value: number, std: number, ) {
    this.name = name;
    this.value = value;
    this.std = std;
  }
}
