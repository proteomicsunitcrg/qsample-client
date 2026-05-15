export interface ChartConfig {
  id: number;
  name: string;
  title: string;
  description: string;
  chartType: string;
  library: string;
  dataSourceKey: string;
  active: boolean;
  parameters: { [key: string]: any };
}
