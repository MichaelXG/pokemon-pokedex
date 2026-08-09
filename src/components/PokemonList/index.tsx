"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import PokemonCard, { PokemonCardSkeleton } from "../PokemonCard";
import PokemonSearch from "../PokemonSearch";
import PokemonPagination from "../PokemonPagination/pokemonPagination";

import styles from "./pokemonList.module.scss";

import useFitPageSize from "@/hooks/useFitPageSize";
import usePokemon from "@/hooks/usePokemon";

export default function PokemonList() {
  const pageRef = useRef<HTMLDivElement>(null);
  const fittedSize = useFitPageSize(pageRef);
  const {
    paginatedPokemon,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    setPageSize,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = usePokemon();

  const hasNoResults =
    !loading && paginatedPokemon.length === 0 && searchTerm !== "";

  useEffect(() => {
    setPageSize(fittedSize);
  }, [fittedSize, setPageSize]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.toolbar}>
        <PokemonSearch onSearch={setSearchTerm} hasNoResults={hasNoResults} />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {hasNoResults ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Nenhum Pokémon encontrado</p>
          <p className={styles.emptyText}>
            Tente outro nome, número da Pokédex ou tipo, como fire, water ou
            grass.
          </p>
        </div>
      ) : (
        <motion.section
          className={styles.grid}
          style={{ ["--page-size" as string]: pageSize }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {loading
            ? Array.from({ length: pageSize }, (_, index) => (
                <div key={index} className={styles.cell}>
                  <PokemonCardSkeleton />
                </div>
              ))
            : paginatedPokemon.map((pokemon, index) => (
                <motion.div
                  key={pokemon.id}
                  className={styles.cell}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                >
                  <PokemonCard pokemon={pokemon} />
                </motion.div>
              ))}
        </motion.section>
      )}

      {!hasNoResults && totalPages > 1 ? (
        <div className={styles.pagination}>
          <PokemonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            showFirstLastButtons={true}
            hidePrevNextButtons={false}
          />
        </div>
      ) : null}
    </div>
  );
}
