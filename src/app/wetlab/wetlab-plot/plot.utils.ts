import { ThresholdForPlot } from '../../models/ThresholdForPlot';
export const LAYOUTDARK = {

  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: "#424242",
  paper_bgcolor: "#424242",
  barmode: 'group',
  xaxis: {
    nticks: 10,
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF'
  },
  yaxis: {
    type: 'linear',
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    // gridcolor: '#FFFFFF',

    // range: rangeArray
  },
  font: {
    family: 'Roboto, monospace',
    color: '#FFFFFF'
  }
};
export const LAYOUTLIGHT = {

  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: "white",
  paper_bgcolor: "white",
  barmode: 'group',
  xaxis: {
    nticks: 10,
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF'
  },
  yaxis: {
    type: 'linear',
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',

    // range: rangeArray
  },
  font: {
    family: 'Roboto, monospace',
    color: 'black'
  }

};

/**
 * To generate the threshold UP lines for the plot layout
 *
 * @param thresholdToDraw - The threshold to generate the lines
 *
 * @returns Array with the lines ready for the plot layout
 */
export function thresholdShapesUP(thresholdToDraw: ThresholdForPlot): any {
  const shapes = [];
  const color: string[] = ['#27AE60', '#FFC300', '#FF5733', '#C70039'];
  for (let i = -1; i < thresholdToDraw.steps; i++) {
    console.log((i + 1) * thresholdToDraw.stepValue);
    const shape = {
      type: 'line',
      x0: 0,
      y0: thresholdToDraw.initialValue + ((i + 1) * thresholdToDraw.stepValue),
      x1: 1,
      y1: thresholdToDraw.initialValue + ((i + 1) * thresholdToDraw.stepValue),
      xref: 'paper',
      fillcolor: 'red',
      // opacity: 0.5,
      line: {
        color: color[i + 1],
        width: 2,
        dash: 'dot'
      },
      layer: 'above'
    };
    shapes.push(shape);
  }
  return shapes;
}

/**
 * To generate the threshold DOWN lines for the plot layout
 *
 * @param thresholdToDraw - The threshold to generate the lines
 *
 * @returns Array with the lines ready for the plot layout
 */
export function thresholdShapesDOWN(thresholdToDraw: ThresholdForPlot): any {
  const shapes = [];
  const color: string[] = ['#27AE60', '#FFC300', '#FF5733', '#C70039'];
  for (let i = -1; i < thresholdToDraw.steps; i++) {
    console.log((i + 1) * thresholdToDraw.stepValue);
    const shape = {
      type: 'line',
      x0: 0,
      y0: thresholdToDraw.initialValue - ((i + 1) * thresholdToDraw.stepValue),
      x1: 1,
      y1: thresholdToDraw.initialValue - ((i + 1) * thresholdToDraw.stepValue),
      xref: 'paper',
      fillcolor: 'red',
      // opacity: 0.5,
      line: {
        color: color[i + 1],
        width: 2,
        dash: 'dot'
      },
      layer: 'above'
    };
    shapes.push(shape);
  }
  return shapes;
}

/**
 * To generate the threshold UPDOWN lines for the plot layout
 *
 * @param thresholdToDraw - The threshold to generate the lines
 *
 * @returns Array with the lines ready for the plot layout
 */
export function thresholdShapesUPDOWN(thresholdToDraw: ThresholdForPlot): any {
  const shapes = [];
  const color: string[] = ['#27AE60', '#FFC300', '#FF5733', '#C70039'];
    // const color: string[] = ['#000000', 'red', '#FF5733', '#C70039'];
  for (let i = -1; i < thresholdToDraw.steps; i++) {
    console.log((i + 1) * thresholdToDraw.stepValue);
    const shape = {
      type: 'line',
      x0: 0,
      y0: thresholdToDraw.initialValue + ((i + 1) * thresholdToDraw.stepValue),
      x1: 1,
      y1: thresholdToDraw.initialValue + ((i + 1) * thresholdToDraw.stepValue),
      xref: 'paper',
      fillcolor: 'red',
      // opacity: 0.5,
      line: {
        color: color[i + 1],
        width: 2,
        dash: 'dot'
      },
      layer: 'above'
    };
    shapes.push(shape);
  }
  for (let i = -1; i < thresholdToDraw.steps; i++) {
    console.log((i + 1) * thresholdToDraw.stepValue);
    const shape = {
      type: 'line',
      x0: 0,
      y0: thresholdToDraw.initialValue - ((i + 1) * thresholdToDraw.stepValue),
      x1: 1,
      y1: thresholdToDraw.initialValue - ((i + 1) * thresholdToDraw.stepValue),
      xref: 'paper',
      fillcolor: 'red',
      // opacity: 0.5,
      line: {
        color: color[i + 1],
        width: 2,
        dash: 'dot'
      },
      layer: 'above'
    };
    shapes.push(shape);
  }
  return shapes;
}