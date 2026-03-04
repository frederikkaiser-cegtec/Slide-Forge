export type ChartType = 'bar' | 'line' | 'donut' | 'area' | 'none';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartConfig {
  type: ChartType;
  data: ChartDataPoint[];
  title?: string;
}
