"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import styles from "../PokemonStatsChart/pokemonStatsChart.module.scss";

// Importa os componentes necessários do Chart.js para configurar o gráfico

// Registra os componentes necessários do Chart.js para o funcionamento do gráfico de barras
ChartJS.register(
  CategoryScale, // Escala para o eixo das categorias (x-axis)
  LinearScale, // Escala para o eixo numérico (y-axis)
  BarElement, // Elemento gráfico para barras
  Title, // Título do gráfico
  Tooltip, // Tooltip que aparece ao passar o mouse sobre as barras
  Legend // Legenda do gráfico
);

interface PokemonStatsChartProps {
  data: any; // Dados do gráfico (deve estar no formato aceito pelo Chart.js)
  options: any; // Opções de configuração do gráfico (como estilo, layout, etc.)
}

// Componente funcional que renderiza um gráfico de barras usando react-chartjs-2
const PokemonStatsChart: React.FC<PokemonStatsChartProps> = ({
  data,
  options,
}) => {
  return (
    <>
      {" "}
      <div className={styles.barChartContainer}>
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default PokemonStatsChart; // Exporta o componente para ser utilizado em outros arquivos
