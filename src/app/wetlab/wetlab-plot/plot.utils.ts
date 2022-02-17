import { ThresholdForPlot } from '../../models/ThresholdForPlot';
export const LAYOUTDARK = {
  autosize: false,
  width: 700,
  height: 450,
  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: '#424242',
  paper_bgcolor: '#424242',
  barmode: 'stack',
  xaxis: {
    // nticks: 10,
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
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
  autosize: false,
  width: 700,
  height: 450,
  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: 'white',
  paper_bgcolor: 'white',
  barmode: 'stack',
  xaxis: {
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1

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

export const LAYOUTDARKHEATMAP = {
  autosize: false,
  width: 600,
  height: 600,
  plot_bgcolor: '#424242',
  paper_bgcolor: '#424242',
  xaxis: {
    // nticks: 10,
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
  },
  yaxis: {
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
  },
  font: {
    family: 'Roboto, monospace',
    color: '#FFFFFF',
    size: 10
  },
  margin: {
    l: 170,
    b: 170,
    pad: 2
  },
}

export const LAYOUTLIGHTHEATMAP = {
  autosize: false,
  width: 700,
  height: 700,
  plot_bgcolor: 'white',
  paper_bgcolor: 'white',
  xaxis: {
    // nticks: 10,
    linecolor: 'black',
    tickcolor: 'black',
    dtick: 1
  },
  yaxis: {
    linecolor: 'black',
    tickcolor: 'black',
    dtick: 1

  },
  font: {
    family: 'Roboto, monospace',
    color: 'black',
    size: 10

  },

  margin: {
    l: 170,
    b: 170,
    pad: 2
  },
}


export const LAYOUTDARKOVERLAY = {
  autosize: false,
  width: 700,
  height: 450,
  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: '#424242',
  paper_bgcolor: '#424242',
  barmode: 'overlay',
  xaxis: {
    // nticks: 10,
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
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
export const LAYOUTLIGHTOVERLAY = {
  autosize: false,
  width: 700,
  height: 450,
  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: 'white',
  paper_bgcolor: 'white',
  barmode: 'overlay',
  xaxis: {
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
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


export const LAYOUTDARKGROUP = {
  autosize: false,
  width: 700,
  height: 450,
  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: '#424242',
  paper_bgcolor: '#424242',
  barmode: 'stack',
  xaxis: {
    // nticks: 10,
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
  },
  yaxis: {
    type: 'linear',
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    exponentformat: 'power'
    // gridcolor: '#FFFFFF',
    // range: rangeArray
  },
  font: {
    family: 'Roboto, monospace',
    color: '#FFFFFF'
  }
};
export const LAYOUTLIGHTGROUP = {
  autosize: false,
  width: 700,
  height: 450,
  shapes: [],
  hovermode: 'closest',
  plot_bgcolor: 'white',
  paper_bgcolor: 'white',
  barmode: 'stack',
  xaxis: {
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    dtick: 1
  },
  yaxis: {
    type: 'linear',
    linecolor: '#FFFFFF',
    tickcolor: '#FFFFFF',
    exponentformat: 'power',
    
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

export function getNavigator(): string {
  let sBrowser, sUsrAg = navigator.userAgent;
  // The order matters here, and this may report false positives for unlisted browsers.

  if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "Mozilla Firefox";
    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
  } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
    sBrowser = "Samsung Internet";
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
  } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
    sBrowser = "Opera";
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
  } else if (sUsrAg.indexOf("Trident") > -1) {
    sBrowser = "Microsoft Internet Explorer";
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (sUsrAg.indexOf("Edge") > -1) {
    sBrowser = "Microsoft Edge (Legacy)";
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  } else if (sUsrAg.indexOf("Edg") > -1) {
    sBrowser = "Microsoft Edge (Chromium)";
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64
  } else if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "Google Chrome or Chromium";
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
  } else if (sUsrAg.indexOf("Safari") > -1) {
    sBrowser = "Apple Safari";
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
  } else {
    sBrowser = "unknown";
  }
  return sBrowser;
}
