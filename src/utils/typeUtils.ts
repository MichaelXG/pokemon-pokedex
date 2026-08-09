const OFFICIAL_TYPES = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "shadow",
  "steel",
  "unknown",
  "water",
] as const;

const typeBackgrounds: Record<string, string> = {
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
  default: "/types/unknown.svg",
};

const typeAliases: Record<string, string[]> = {
  grass: ["plant", "flora", "seed"],
  fire: ["flame", "burn"],
  water: ["aqua", "liquid", "tiny turtle", "turtle", "shellfish"],
  dragon: ["lizard"],
  bug: ["worm", "cocoon", "butterfly", "hairy bug", "bee"],
};

Object.entries(typeAliases).forEach(([type, aliases]) => {
  aliases.forEach((alias) => {
    typeBackgrounds[alias] = typeBackgrounds[type];
  });
});

export function resolvePokeType(query: string): string | null {
  const normalized = query.toLowerCase().trim();
  if ((OFFICIAL_TYPES as readonly string[]).includes(normalized)) {
    return normalized;
  }

  const aliasMatch = Object.entries(typeAliases).find(([, aliases]) =>
    aliases.includes(normalized)
  );

  return aliasMatch?.[0] ?? null;
}

export const getTypeBackgroundUrl = (typeName: string): string => {
  if (!typeName) {
    return typeBackgrounds.default;
  }
  return typeBackgrounds[typeName.toLowerCase()] || typeBackgrounds.default;
};

const TYPE_COLORS: Record<string, string> = {
  bug: "#A6B91A",
  dark: "#705746",
  dragon: "#6F35FC",
  electric: "#F7D02C",
  fairy: "#D685AD",
  fighting: "#C22E28",
  fire: "#EE8130",
  flying: "#A98FF3",
  ghost: "#735797",
  grass: "#7AC74C",
  ground: "#E2BF65",
  ice: "#96D9D6",
  normal: "#A8A77A",
  poison: "#A33EA1",
  psychic: "#F95587",
  rock: "#B6A136",
  shadow: "#5A5A5A",
  steel: "#B7B7CE",
  unknown: "#68A090",
  water: "#6390F0",
};

export function getTypeColor(typeName: string): string {
  return TYPE_COLORS[typeName.toLowerCase()] || TYPE_COLORS.normal;
}

const TYPE_LABELS: Record<string, string> = {
  bug: "Inseto",
  dark: "Sombrio",
  dragon: "Dragão",
  electric: "Elétrico",
  fairy: "Fada",
  fighting: "Lutador",
  fire: "Fogo",
  flying: "Voador",
  ghost: "Fantasma",
  grass: "Planta",
  ground: "Terrestre",
  ice: "Gelo",
  normal: "Normal",
  poison: "Venenoso",
  psychic: "Psíquico",
  rock: "Pedra",
  shadow: "Sombra",
  steel: "Aço",
  unknown: "Desconhecido",
  water: "Água",
};

export function getTypeLabel(typeName: string): string {
  const key = typeName.toLowerCase();
  return TYPE_LABELS[key] || typeName.charAt(0).toUpperCase() + typeName.slice(1);
}
