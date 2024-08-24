"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import PokemonPicture from "../PokemonPicture";
import PokemonSearch from "../PokemonSearch";
import PokemonPagination from "../PokemonPagination/pokemonPagination";

import styles from "./pokemonList.module.scss";

import usePokemon from "@/hooks/usePokemon";
import Loader from "@/app/Loader";

export default function PokemonList() {
  const {
    paginatedPokemon,
    currentPage,
    totalPages,
    setPage,
    loading,
    setFilteredPokemon,
    pokemonData,
  } = usePokemon();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getPokemonIdFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("pokemonId");
    if (idParam && !isNaN(Number(idParam))) {
      return parseInt(idParam, 10);
    }
    return null;
  }, []);

  useEffect(() => {
    const idFromUrl = getPokemonIdFromUrl();
    if (idFromUrl !== null) {
      setActiveId(idFromUrl);
    }
  }, [getPokemonIdFromUrl]);

  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();

    const filteredPokemons = pokemonData.filter((pokemon) => {
      const idMatch =
        !isNaN(Number(searchTerm)) && pokemon.id === Number(searchTerm);
      const nameMatch = pokemon.name.toLowerCase().includes(searchLower);
      const typeMatch = pokemon.types.some((type) =>
        type.type.name.toLowerCase().includes(searchLower)
      );

      if (!isNaN(Number(searchTerm)) && searchTerm !== "") {
        return idMatch;
      }

      return nameMatch || typeMatch;
    });

    setFilteredPokemon(filteredPokemons);
  }, [searchTerm, pokemonData, setFilteredPokemon]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="top-bar">
        <PokemonSearch
          onSearch={(term) => setSearchTerm(term)}
          hasNoResults={paginatedPokemon.length === 0 && searchTerm !== ""}
        />
      </div>

      <div className={`content ${styles.pokemons}`}>
        <motion.section
          className={styles.pokemons}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {paginatedPokemon.map((pokemon) => (
            <motion.div
              key={pokemon.id}
              className={`${styles.imageContainer} ${styles[pokemon.id]} ${
                activeId === pokemon.id ? styles.active : ""
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveId(pokemon.id)}
            >
              <Link href={`/pokemon/${pokemon.id}`}>
                <PokemonPicture
                  pokemon={pokemon}
                  isMainPage={true}
                  clickedId={activeId ?? 0}
                />
              </Link>
            </motion.div>
          ))}
        </motion.section>
      </div>

      <div className="bottom-bar">
        <PokemonPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          showFirstLastButtons={true}
          hidePrevNextButtons={false}
        />
      </div>
    </>
  );
}
