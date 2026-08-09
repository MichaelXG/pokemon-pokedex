import type { IPokemon, IPokemonEvolution } from "@/interfaces/IPokemon";
import type { PokemonPageResult } from "@/lib/pokeapi";

export async function fetchPokemonPage(
  page: number,
  limit: number,
  q = ""
): Promise<PokemonPageResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (q.trim()) params.set("q", q.trim());

  const response = await fetch(`/api/pokemon?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list");
  }

  return response.json() as Promise<PokemonPageResult>;
}

export async function fetchPokemonById(id: number): Promise<IPokemon> {
  const response = await fetch(`/api/pokemon/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon");
  }

  return response.json() as Promise<IPokemon>;
}

export async function fetchEvolutions(id: number): Promise<IPokemonEvolution[]> {
  const response = await fetch(`/api/pokemon/${id}/evolutions`);
  if (!response.ok) {
    throw new Error("Failed to fetch evolutions");
  }

  return response.json() as Promise<IPokemonEvolution[]>;
}

export async function fetchDexMeta(): Promise<{ count: number; minId: number }> {
  const response = await fetch("/api/pokemon/meta");
  if (!response.ok) {
    throw new Error("Failed to fetch dex meta");
  }

  return response.json() as Promise<{ count: number; minId: number }>;
}
