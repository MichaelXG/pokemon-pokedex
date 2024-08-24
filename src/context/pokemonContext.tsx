"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";

import { IPokemon } from "@/interfaces/IPokemon";
import { fetchAllPokedex } from "@/app/api/services";
import { DEFAULT_LIMIT } from "@/utils/globalUtils";

// Tipo do contexto
interface IPokemonContext {
  pokemonData: IPokemon[];
  filteredPokemon: IPokemon[]; // Novo estado para armazenar os Pokémon filtrados
  loading: boolean;
  error: string | null;
  paginatedPokemon: IPokemon[];
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  setFilteredPokemon: (filtered: IPokemon[]) => void; // Função para definir os Pokémon filtrados
}

// Valor padrão do contexto
const defaultContextValue: IPokemonContext = {
  pokemonData: [],
  filteredPokemon: [],
  loading: false,
  error: null,
  paginatedPokemon: [],
  currentPage: 1,
  totalPages: 1,
  setPage: () => {},
  setFilteredPokemon: () => {},
};

// Criação do contexto
const PokemonContext = createContext<IPokemonContext>(defaultContextValue);

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pokemonData, setPokemonData] = useState<IPokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<IPokemon[]>([]); // Estado para Pokémon filtrados
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedPokemon, setPaginatedPokemon] = useState<IPokemon[]>([]);

  const pokemonsPerPage = DEFAULT_LIMIT;

  useEffect(() => {
    const loadAllPokemons = async () => {
      console.log("Starting to fetch Pokémon data...");
      setLoading(true);

      try {
        const allPokemons = await fetchAllPokedex();
        console.log("Successfully fetched Pokémon data:", allPokemons);
        setPokemonData(allPokemons);
        setFilteredPokemon(allPokemons); // Inicialmente, os Pokémon filtrados são todos
        setError(null);
      } catch (err) {
        console.error("Error fetching Pokémon data:", err);
        setError("Failed to fetch Pokémon data.");
      } finally {
        setLoading(false);
        console.log("Finished fetching Pokémon data.");
      }
    };

    loadAllPokemons();
  }, []);

  useEffect(() => {
    const start = (currentPage - 1) * pokemonsPerPage;
    const end = start + pokemonsPerPage;
    setPaginatedPokemon(filteredPokemon.slice(start, end)); // Pagina os Pokémon filtrados
  }, [filteredPokemon, currentPage, pokemonsPerPage]);

  const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage); // Total de páginas baseado nos Pokémon filtrados

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <PokemonContext.Provider
      value={{
        pokemonData,
        filteredPokemon,
        loading,
        error,
        paginatedPokemon,
        currentPage,
        totalPages,
        setPage,
        setFilteredPokemon, // Passa a função para definir Pokémon filtrados
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonContext;
