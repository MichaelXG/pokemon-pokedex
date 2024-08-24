// Mapeamento de tipos para URLs de imagens
const typeBackgrounds: { [key: string]: string } = {
  bug: "/types/bug.svg",
  dark: "/types/dark.svg",
  dragon: "/types/dragon.svg",
  electric: "/types/electric.svg",
  fairy: "/types/fairy.svg",
  fighting: "/types/fighting.svg",
  fire: "/types/fire.svg",
  flying: "/types/flying.svg",
  ghost: "/types/ghost.svg",
  grass: "/types/grass.svg",
  ground: "/types/ground.svg",
  ice: "/types/ice.svg",
  normal: "/types/normal.svg",
  poison: "/types/poison.svg",
  psychic: "/types/psychic.svg",
  rock: "/types/rock.svg",
  shadow: "/types/shadow.svg",
  steel: "/types/steel.svg",
  unknown: "/types/unknown.svg",
  water: "/types/water.svg",
  default: "/types/default.svg",
};

// Definição explícita dos aliases
const typeAliases: { [key: string]: string[] } = {
  grass: ["plant", "flora", "seed"],
  fire: ["flame", "burn"],
  water: ["aqua", "liquid", "tiny turtle", "turtle", "shellfish"],
  dragon: ["lizard", "flame"],
  bug: ["worm", "cocoon", "butterfly", "hairy bug", "bee"],
  // poison: ["poison bee"],
};

// Expande o objeto typeBackgrounds para incluir os aliases
Object.keys(typeAliases).forEach((key) => {
  typeAliases[key].forEach((alias) => {
    typeBackgrounds[alias] = typeBackgrounds[key];
  });
});

// Função para retornar a URL da imagem correspondente ao tipo do Pokémon
export const getTypeBackgroundUrl = (typeName: any): string => {
  if (typeof typeName !== "string") {
    console.error("Invalid typeName:", typeName);
    return typeBackgrounds.default;
  }
  return typeBackgrounds[typeName.toLowerCase()] || typeBackgrounds.default;
};
