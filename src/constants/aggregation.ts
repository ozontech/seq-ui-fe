import { ChartLine, ChartPie, Sheet } from "lucide-vue-next";

export const AGGREGATION_TYPES = [
  {
    id: 'table',
    Icon: Sheet,
    name: 'Table',
  },
  {
    id: 'pie-chart',
    Icon: ChartPie,
    name: 'Pie chart',
  },
  {
    id: 'linear-chart',
    Icon: ChartLine,
    name: 'LinearChart',
  },
] as const
