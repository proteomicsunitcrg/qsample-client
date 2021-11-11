export class ApplicationConstraint {

  id: number;
  name: string;
  showFileInfoPlot: boolean;
  showIdentifiedPeptidesPlot: boolean;
  showIdentifiedProteinsPlot: boolean;
  showModificationsPlot: boolean;
  showQuantificationAndContaminantList: boolean;
  showQuantificationHeatMap: boolean;
  showDendogram: boolean;
  showChargesPlot: boolean;
  showHistonesBiological: boolean;
  showHistonesTailored: boolean;


  constructor(id: number, name: string, showFileInfoPlot: boolean, showIdentifiedPeptidesPlot: boolean,
    showIdentifiedProteinsPlot: boolean, showModificationsPlot: boolean, showQuantificationAndContaminantList: boolean,
    showQuantificationHeatMap: boolean, showDendogram: boolean, showChargesPlot: boolean, showHistonesBiological: boolean, showHistonesTailored: boolean) {
    this.id = id;
    this.name = name;
    this.showFileInfoPlot = showFileInfoPlot;
    this.showIdentifiedPeptidesPlot = showIdentifiedPeptidesPlot;
    this.showIdentifiedProteinsPlot = showIdentifiedProteinsPlot;
    this.showModificationsPlot = showModificationsPlot;
    this.showQuantificationAndContaminantList = showQuantificationAndContaminantList;
    this.showQuantificationHeatMap = showQuantificationHeatMap;
    this.showDendogram = showDendogram;
    this.showChargesPlot = showChargesPlot;
    this.showHistonesBiological = showHistonesBiological;
    this.showHistonesTailored = showHistonesTailored;
  }
}
