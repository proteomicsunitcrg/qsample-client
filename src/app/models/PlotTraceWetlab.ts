import { TraceColor } from './TraceColor';
import { PlotTracePointWetlab } from './PlotTracePointWetlab';

export class PlotTraceWetlab {
  abbreviated: string;
  traceColor: TraceColor;
  shade: number;
  plotTracePoints: PlotTracePointWetlab[];
  contextSourceId: number;

  constructor(abbreviated: string, traceColor: TraceColor, shade: number,
    plotTracePoints: PlotTracePointWetlab[], contextSourceId: number) {
    this.abbreviated = abbreviated;
    this.traceColor = traceColor;
    this.shade = shade;
    this.plotTracePoints = plotTracePoints;
    this.contextSourceId = contextSourceId;
  }
}
