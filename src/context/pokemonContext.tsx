"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import { IPokemon } from "@/interfaces/IPokemon";
import { fetchPokemonPage } from "@/lib/pokemonClient";
import { DEFAULT_LIMIT, MAX_PAGE_SIZE } from "@/utils/globalUtils";

export interface IPokemonContext {
  paginatedPokemon: IPokemon[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  searchTerm: string;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchTerm: (term: string) => void;
}

const PokemonContext = createContext<IPokemonContext | null>(null);

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [paginatedPokemon, setPaginatedPokemon] = useState<IPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageSize, setPageSizeState] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== debouncedSearch) {
        setDebouncedSearch(searchTerm);
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      setLoading(true);
      try {
        const data = await fetchPokemonPage(
          currentPage,
          pageSize,
          debouncedSearch
        );
        if (cancelled) return;
        setPaginatedPokemon(data.results);
        setTotalPages(data.totalPages);
        setTotalCount(data.count);
        setError(null);
      } catch {
        if (cancelled) return;
        setError("Failed to fetch Pokémon data.");
        setPaginatedPokemon([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPage();
    return () => {
      cancelled = true;
    };
  }, [currentPage, debouncedSearch, pageSize]);

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  const setPageSize = useCallback((nextSize: number) => {
    const next = Math.max(1, Math.min(MAX_PAGE_SIZE, Math.round(nextSize)));
    setPageSizeState((prev) => {
      if (prev === next) return prev;
      setCurrentPage((page) => Math.floor(((page - 1) * prev) / next) + 1);
      return next;
    });
  }, []);

  return (
    <PokemonContext.Provider
      value={{
        paginatedPokemon,
        loading,
        error,
        currentPage,
        totalPages,
        totalCount,
        pageSize,
        searchTerm,
        setPage,
        setPageSize,
        setSearchTerm,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export default PokemonContext;
