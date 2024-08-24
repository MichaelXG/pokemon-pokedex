// Interface simplificada para dados de gráfico
export interface BasicChartData<T = "bar" | "line" | "doughnut" | "pie"> {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Interface para gráficos de barras e linhas
export interface IChartData extends BasicChartData<"bar" | "line"> {}

// Interface para gráficos de rosca e pizza
export interface IDoughnutChartData
  extends BasicChartData<"doughnut" | "pie"> {}

// Interface para opções de gráficos de barras e linhas
export interface IChartOptions {
  responsive?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: {
      beginAtZero?: boolean;
    };
    y?: {
      beginAtZero?: boolean;
    };
  };
}
