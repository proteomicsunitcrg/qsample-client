import { TraceColor } from './TraceColor';
import { PlotTracePoint } from './PlotTracePoint';

export class PlotTrace {
    abbreviated: string;
    traceColor: TraceColor;
    shade: number;
    plotTracePoints: PlotTracePoint[];
    contextSourceId: number;

    constructor(abbreviated: string, traceColor: TraceColor, shade: number,
        plotTracePoints: PlotTracePoint[], contextSourceId: number) {
        this.abbreviated = abbreviated;
        this.traceColor = traceColor;
        this.shade = shade;
        this.plotTracePoints = plotTracePoints;
        this.contextSourceId = contextSourceId;
    }
}
