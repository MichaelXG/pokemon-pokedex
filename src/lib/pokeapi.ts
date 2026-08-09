import { IPokemon, IPokemonEvolution, IType } from "@/interfaces/IPokemon";
import { getGenderDistribution } from "@/lib/gender";
import { computeWeaknesses, TypeDamageRelations } from "@/lib/weaknesses";
import { resolvePokeType } from "@/utils/typeUtils";

const BASE_URL = "https://pokeapi.co/api/v2";
const REVALIDATE_SECONDS = 60 * 60 * 24;

interface NamedResource {
  name: string;
  url: string;
}

interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: IPokemon["abilities"];
  types: IType[];
  stats: IPokemon["stats"];
  sprites: IPokemon["sprites"];
  species: NamedResource;
  cries?: {
    latest?: string;
    legacy?: string;
  };
}

interface PokeApiSpecies {
  id: number;
  name: string;
  gender_rate: number;
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
  evolution_chain: { url: string };
  varieties: {
    is_default: boolean;
    pokemon: NamedResource;
  }[];
}

interface PokeApiType {
  name: string;
  damage_relations: {
    double_damage_from: NamedResource[];
    half_damage_from: NamedResource[];
    no_damage_from: NamedResource[];
  };
  pokemon: { pokemon: NamedResource }[];
}

interface EvolutionChainLink {
  species: NamedResource;
  evolves_to: EvolutionChainLink[];
}

export interface PokemonPageResult {
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  results: IPokemon[];
}

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

function toApiPath(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/api\/v2/, "") || parsed.pathname;
  } catch {
    return url;
  }
}

function isMegaForm(name: string) {
  return name.toLowerCase().includes("-mega");
}

function toEvolution(pokemon: PokeApiPokemon): IPokemonEvolution {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites.other?.["official-artwork"]?.front_default ||
      pokemon.sprites.front_default,
    types: pokemon.types,
    type_evol: [],
  };
}

async function pokeFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`PokeAPI ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function names(resources: NamedResource[]): string[] {
  return resources.map((resource) => resource.name);
}

async function getTypeChartEntry(typeName: string): Promise<TypeDamageRelations> {
  const data = await pokeFetch<PokeApiType>(`/type/${typeName}`);
  return {
    double_damage_from: names(data.damage_relations.double_damage_from),
    half_damage_from: names(data.damage_relations.half_damage_from),
    no_damage_from: names(data.damage_relations.no_damage_from),
  };
}

async function getPokemonWeaknesses(types: IType[]): Promise<string[]> {
  const defenderTypes = types.map((entry) => entry.type.name);
  const chartEntries = await Promise.all(
    defenderTypes.map(async (typeName) => [typeName, await getTypeChartEntry(typeName)] as const)
  );

  return computeWeaknesses(defenderTypes, Object.fromEntries(chartEntries));
}

function mapPokemon(
  pokemon: PokeApiPokemon,
  species: PokeApiSpecies,
  weaknesses: string[]
): IPokemon {
  const description =
    species.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ")
      .replace(/\n/g, " ")
      .trim() || "";

  const category =
    species.genera
      .find((genus) => genus.language.name === "en")
      ?.genus.replace("Pokémon", "")
      .trim() || "Unknown";

  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities,
    types: pokemon.types,
    stats: pokemon.stats,
    sprites: pokemon.sprites,
    species: {
      name: species.name,
      url: `${BASE_URL}/pokemon-species/${species.id}/`,
      gender_rate: species.gender_rate,
      flavor_text_entries: species.flavor_text_entries,
      genera: species.genera,
    },
    description,
    gender: getGenderDistribution(species.gender_rate),
    category,
    weaknesses,
    cry: pokemon.cries?.latest || pokemon.cries?.legacy,
  };
}

export async function getSpeciesCount(): Promise<number> {
  const data = await pokeFetch<{ count: number }>("/pokemon-species?limit=1");
  return data.count;
}

export async function getSpeciesIndex(): Promise<{ id: number; name: string }[]> {
  const data = await pokeFetch<{ results: NamedResource[] }>(
    "/pokemon-species?limit=10000"
  );

  return data.results.map((item) => ({
    id: extractIdFromUrl(item.url),
    name: item.name,
  }));
}

export async function getPokemonDetails(idOrName: number | string): Promise<IPokemon> {
  const pokemon = await pokeFetch<PokeApiPokemon>(`/pokemon/${idOrName}`);
  const species = await pokeFetch<PokeApiSpecies>(toApiPath(pokemon.species.url));

  const weaknesses = await getPokemonWeaknesses(pokemon.types);
  return mapPokemon(pokemon, species, weaknesses);
}

async function getDetailsByIds(ids: number[]): Promise<IPokemon[]> {
  const settled = await Promise.allSettled(ids.map((id) => getPokemonDetails(id)));
  return settled
    .filter((result): result is PromiseFulfilledResult<IPokemon> => result.status === "fulfilled")
    .map((result) => result.value);
}

export async function queryPokemonPage(options: {
  page: number;
  limit: number;
  q?: string;
}): Promise<PokemonPageResult> {
  const page = Math.max(1, options.page);
  const limit = Math.min(48, Math.max(1, options.limit));
  const query = options.q?.trim().toLowerCase() ?? "";

  if (query) {
    return searchPokemonPage(query, page, limit);
  }

  const offset = (page - 1) * limit;
  const list = await pokeFetch<{ count: number; results: NamedResource[] }>(
    `/pokemon-species?offset=${offset}&limit=${limit}`
  );
  const ids = list.results.map((item) => extractIdFromUrl(item.url));
  const results = await getDetailsByIds(ids);
  const totalPages = Math.max(1, Math.ceil(list.count / limit));

  return {
    count: list.count,
    page,
    limit,
    totalPages,
    results,
  };
}

async function searchPokemonPage(
  query: string,
  page: number,
  limit: number
): Promise<PokemonPageResult> {
  if (/^\d+$/.test(query)) {
    try {
      const pokemon = await getPokemonDetails(Number(query));
      return { count: 1, page: 1, limit, totalPages: 1, results: [pokemon] };
    } catch {
      return { count: 0, page: 1, limit, totalPages: 1, results: [] };
    }
  }

  const typeName = resolvePokeType(query);

  if (typeName) {
    const typeData = await pokeFetch<PokeApiType>(`/type/${typeName}`);
    const maxId = await getSpeciesCount();
    const ids = typeData.pokemon
      .map((entry) => extractIdFromUrl(entry.pokemon.url))
      .filter((id) => id > 0 && id <= maxId);

    const uniqueIds = Array.from(new Set(ids));
    const slice = uniqueIds.slice((page - 1) * limit, page * limit);
    const results = await getDetailsByIds(slice);

    return {
      count: uniqueIds.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(uniqueIds.length / limit)),
      results,
    };
  }

  const index = await getSpeciesIndex();
  const matches = index.filter((item) => item.name.includes(query));
  const slice = matches.slice((page - 1) * limit, page * limit);
  const results = await getDetailsByIds(slice.map((item) => item.id));

  return {
    count: matches.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(matches.length / limit) || 1),
    results,
  };
}

async function fetchMegaEvolutions(speciesName: string): Promise<IPokemonEvolution[]> {
  const species = await pokeFetch<PokeApiSpecies>(`/pokemon-species/${speciesName}`);
  const megaNames = (species.varieties || [])
    .filter((variety) => !variety.is_default && isMegaForm(variety.pokemon.name))
    .map((variety) => variety.pokemon.name);

  if (megaNames.length === 0) return [];

  const megas = await Promise.all(
    megaNames.map((name) => pokeFetch<PokeApiPokemon>(`/pokemon/${name}`))
  );

  return megas.map(toEvolution);
}

async function collectEvolutions(
  link: EvolutionChainLink
): Promise<IPokemonEvolution[]> {
  const [pokemon, megas, branches] = await Promise.all([
    pokeFetch<PokeApiPokemon>(`/pokemon/${link.species.name}`),
    fetchMegaEvolutions(link.species.name),
    Promise.all(link.evolves_to.map(collectEvolutions)),
  ]);

  const current: IPokemonEvolution = {
    ...toEvolution(pokemon),
    type_evol: branches.map((branch) => branch[0]).filter(Boolean),
  };

  return [current, ...megas, ...branches.flat()];
}

export async function getEvolutions(pokemonId: number): Promise<IPokemonEvolution[]> {
  const pokemon = await pokeFetch<PokeApiPokemon>(`/pokemon/${pokemonId}`);
  const species = await pokeFetch<PokeApiSpecies>(toApiPath(pokemon.species.url));
  const chainId = extractIdFromUrl(species.evolution_chain.url);
  const chain = await pokeFetch<{ chain: EvolutionChainLink }>(
    `/evolution-chain/${chainId}`
  );

  const evolutions = await collectEvolutions(chain.chain);
  const unique = new Map<number, IPokemonEvolution>();
  for (const evolution of evolutions) {
    if (!unique.has(evolution.id)) unique.set(evolution.id, evolution);
  }

  return Array.from(unique.values());
}
