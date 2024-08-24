import localFont from "next/font/local";

// Configura a fonte personalizada do Pokémon
export const pokemonFont = localFont({
  src: "../fonts/pokemon-pokedex.otf", // Caminho para o arquivo da fonte OTF (OpenType Font) localizado na pasta de fontes
  weight: "400", // Define o peso da fonte (normal)
  display: "swap", // Define o comportamento de troca da fonte para melhorar o desempenho de carregamento
});
