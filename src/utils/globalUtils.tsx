import { IPokemon } from "@/interfaces/IPokemon";
export const LOGGING_ENABLED = true; // Defina como false para desativar os logs

export const DEFAULT_LIMIT = 12;
export const DEFAULT_LIMIT_ALL = 200; //2000

export const MALE_IMAGE = "/icons/male.svg";
export const FEMALE_IMAGE = "/icons/female.svg";

// Função para formatar o ID do Pokémon com quatro dígitos
export const formatId = (id: number | undefined) => {
  if (id === undefined || id === null) {
    return "0000";
  }
  return id.toString().padStart(4, "0");
};

// Função para capitalizar a primeira letra do nome do Pokémon
export const formatName = (name: string | undefined) => {
  if (!name) {
    return ""; // Retorna uma string vazia se name for undefined ou falsy
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Type guard to check if an object is of type IPokemon
export function isIPokemon(obj: any): obj is IPokemon {
  return "id" in obj;
}

export function isIPokemonArray(obj: any): obj is IPokemon[] {
  return Array.isArray(obj) && obj.length > 0 && "id" in obj[0];
}

// Handle arrays and type checks
export function isArray(obj: any): obj is any[] {
  return Array.isArray(obj);
}
