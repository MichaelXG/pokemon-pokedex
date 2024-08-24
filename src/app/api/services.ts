"use client";

import { IPokemon, IPokemonEvolution, IType } from "@/interfaces/IPokemon";
import { DEFAULT_LIMIT_ALL, LOGGING_ENABLED } from "@/utils/globalUtils";

const BASE_URL = "https://pokeapi.co/api/v2";

// Função para obter a distribuição de gênero
function getGenderDistribution(genderRate: number) {
  switch (genderRate) {
    case -1:
      return { male: "Unknown", female: "Unknown" };
    case 0:
      return { male: "0%", female: "0%" };
    case 1:
      return { male: "87.5%", female: "12.5%" };
    case 2:
      return { male: "75%", female: "25%" };
    case 3:
      return { male: "50%", female: "50%" };
    case 4:
      return { male: "25%", female: "75%" };
    case 5:
      return { male: "12.5%", female: "87.5%" };
    case 6:
      return { male: "0%", female: "100%" };
    case 8:
      return { male: "Varies", female: "Varies" };
    default:
      return { male: "Unknown", female: "Unknown" };
  }
}

// Função para limpar categorias e converter para minúsculas
function cleanCategory(categoriesRaw: string[]): string[] {
  return categoriesRaw
    .map(
      (categoryRaw) =>
        categoryRaw
          .replace(/Monster/gi, "") // Remove "Monster" (case-insensitive)
          .replace(/Pokémon/gi, "") // Remove "Pokémon" (case-insensitive)
          .replace(/\d+/g, "") // Remove números
          .replace(/[^a-zA-Z\s]/g, "") // Remove caracteres não alfabéticos e não espaços
          .replace(/\s+/g, " ") // Substitui múltiplos espaços por um único espaço
          .trim() || "unknown" // Remove espaços extras e define "unknown" se estiver vazio
    )
    .map((category) => category.toLowerCase()); // Converte para minúsculas
}

export async function fetchAllPokedex(): Promise<IPokemon[]> {
  const allPokemon: IPokemon[] = [];
  const limit = DEFAULT_LIMIT_ALL; // Adjust the limit if needed

  try {
    // Fetch a list of Pokémon
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
      const error = `Failed to fetch Pokémon data`;
      if (LOGGING_ENABLED) console.error(error);
      throw new Error(error);
    }

    const data = await response.json();
    if (LOGGING_ENABLED) console.log("Pokemon list data:", data);

    // Fetch individual Pokémon details
    for (const pokemon of data.results) {
      try {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          const error = `Failed to fetch Pokémon details for ${pokemon.name}`;
          if (LOGGING_ENABLED) console.error(error);
          continue; // Skip this Pokémon and proceed to the next
        }

        const pokemonData = await pokemonResponse.json();
        const speciesResponse = await fetch(
          `${BASE_URL}/pokemon-species/${pokemonData.id}`
        );
        if (!speciesResponse.ok) {
          const error = `Failed to fetch Pokémon species data for ${pokemonData.name}`;
          if (LOGGING_ENABLED) console.error(error);
          continue; // Skip this Pokémon and proceed to the next
        }

        const speciesData = await speciesResponse.json();

        const description =
          speciesData.flavor_text_entries.find(
            (entry: any) => entry.language.name === "en"
          )?.flavor_text || "";

        const { male, female } = getGenderDistribution(speciesData.gender_rate);

        const category =
          speciesData.genera
            .find((genus: any) => genus.language.name === "en")
            ?.genus.replace("Pokémon", "")
            .trim() || "Unknown";

        // Fetch type weaknesses
        const weaknesses = await getPokemonWeaknesses(pokemonData.types);
        if (LOGGING_ENABLED) console.log("Weaknesses:", weaknesses);

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        if (!evolutionResponse.ok) {
          const error = `Failed to fetch evolution chain data for ${pokemonData.name}`;
          if (LOGGING_ENABLED) console.error(error);
          continue; // Skip this Pokémon and proceed to the next
        }

        const evolutionData = await evolutionResponse.json();
        if (LOGGING_ENABLED) console.log("Evolution data:", evolutionData);

        const evolutions = await fetchEvolutions(pokemonData.id); // Use the id to fetch evolutions
        if (LOGGING_ENABLED) console.log("Evolutions:", evolutions);

        const pokemonDetails: IPokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          height: pokemonData.height,
          weight: pokemonData.weight,
          abilities: pokemonData.abilities,
          types: pokemonData.types,
          location_areas: pokemonData.location_area_encounters,
          stats: pokemonData.stats,
          sprites: pokemonData.sprites,
          species: {
            name: speciesData.name,
            url: speciesData.url,
            gender_rate: speciesData.gender_rate,
            flavor_text_entries: speciesData.flavor_text_entries,
            genera: speciesData.genera,
          },
          description,
          gender: { male, female },
          category,
          weaknesses,
        };

        if (LOGGING_ENABLED)
          console.log(
            `Fetched Pokémon details for ${pokemonData.name}:`,
            pokemonDetails
          );

        allPokemon.push(pokemonDetails);
      } catch (error) {
        if (error instanceof Error) {
          if (LOGGING_ENABLED)
            console.error(`Error processing Pokémon details: ${error.message}`);
        } else {
          if (LOGGING_ENABLED)
            console.error(`Unknown error occurred: ${String(error)}`);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (LOGGING_ENABLED)
        console.error(`Error fetching Pokémon list: ${error.message}`);
    } else {
      if (LOGGING_ENABLED)
        console.error(`Unknown error occurred: ${String(error)}`);
    }
  }

  return allPokemon;
}

// Função para obter fraquezas baseadas nos tipos de Pokémon
async function getPokemonWeaknesses(types: IType[]): Promise<string[]> {
  const typeNames = types.map((type) => type.type.name);
  const weaknesses: Set<string> = new Set();

  for (const type of typeNames) {
    const typeResponse = await fetch(`${BASE_URL}/type/${type}`);
    if (!typeResponse.ok) {
      const error = `Failed to fetch type data for ${type}`;
      if (LOGGING_ENABLED) console.error(error);
      throw new Error(error);
    }
    const typeData = await typeResponse.json();
    const doubleDamageTo = typeData.damage_relations.double_damage_to.map(
      (type: any) => type.name
    );
    doubleDamageTo.forEach((w: string) => weaknesses.add(w));
  }

  if (LOGGING_ENABLED) console.log("Weaknesses:", Array.from(weaknesses));

  return Array.from(weaknesses);
}

// Função recursiva para buscar dados de evolução a partir de um id
export async function fetchEvolutions(
  pokemonId: number
): Promise<IPokemonEvolution[]> {
  if (LOGGING_ENABLED)
    console.log(`Fetching evolutions for Pokémon ID: ${pokemonId}`);

  const speciesResponse = await fetch(
    `${BASE_URL}/pokemon-species/${pokemonId}`
  );
  if (!speciesResponse.ok) {
    const error = `Failed to fetch Pokémon species data for ${pokemonId}`;
    if (LOGGING_ENABLED) console.error(error);
    throw new Error(error);
  }
  const speciesData = await speciesResponse.json();
  if (LOGGING_ENABLED) console.log("Species data for evolutions:", speciesData);

  const evolutionChainUrl = speciesData.evolution_chain.url;
  const evolutionResponse = await fetch(evolutionChainUrl);
  if (!evolutionResponse.ok) {
    const error = `Failed to fetch evolution chain data for ${pokemonId}`;
    if (LOGGING_ENABLED) console.error(error);
    throw new Error(error);
  }
  const evolutionData = await evolutionResponse.json();
  if (LOGGING_ENABLED) console.log("Evolution chain data:", evolutionData);

  return await processEvolutionChain(evolutionData.chain);
}

async function processEvolutionChain(chain: any): Promise<IPokemonEvolution[]> {
  const evolutions: IPokemonEvolution[] = [];

  const fetchEvolutionData = async (evolution: any) => {
    if (LOGGING_ENABLED)
      console.log(`Fetching evolution data for ${evolution.species.name}`);

    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`
    );
    if (!res.ok) {
      const error = `Failed to fetch Pokémon data for ${evolution.species.name}`;
      if (LOGGING_ENABLED) console.error(error);
      throw new Error(error);
    }
    const data = await res.json();
    if (LOGGING_ENABLED)
      console.log(
        `Fetched evolution data for ${evolution.species.name}:`,
        data
      );
    return data;
  };

  const fetchEvolutionDetails = async (evolution: any) => {
    const evolutionData = await fetchEvolutionData(evolution);

    const evolutionDetails: IPokemonEvolution = {
      id: evolutionData.id,
      name: evolutionData.name,
      image: evolutionData.sprites.front_default,
      types: evolutionData.types,
      type_evol: await Promise.all(
        evolution.evolves_to.map(fetchEvolutionDetails)
      ),
    };
    if (LOGGING_ENABLED)
      console.log(
        `Processed evolution details for ${evolutionData.name}:`,
        evolutionDetails
      );
    return evolutionDetails;
  };

  const processChain = async (chain: any) => {
    if (chain.species) {
      const evolution = await fetchEvolutionDetails(chain);
      evolutions.push(evolution);
    }
    await Promise.all(chain.evolves_to.map(processChain));
  };

  await processChain(chain);

  return evolutions;
}
