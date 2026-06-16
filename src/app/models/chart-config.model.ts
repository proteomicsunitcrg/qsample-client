export interface ChartConfig {
  id: number;
  name: string;
  title: string;
  description: string;
  chartType: string;
  library: string;
  dataSourceKey: string;
  chartMode: string;
  active: boolean;
  parameters: { [key: string]: any };
}
