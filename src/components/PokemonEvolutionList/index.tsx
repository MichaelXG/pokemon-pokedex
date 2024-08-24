"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import PokemonEvolutionPicture from "../PokemonEvolutioPicture";

import styles from "./pokemonEvolutionList.module.scss";

import { IPokemonEvolution } from "@/interfaces/IPokemon";
import { fetchEvolutions } from "@/app/api/services";
import { pokemonFont } from "@/fonts";

const LOGGING_ENABLED = true;

interface PokemonEvolutionListProps {
  pokemonId: number;
}

const removeDuplicates = (
  evolutions: IPokemonEvolution[]
): IPokemonEvolution[] => {
  const uniqueEvolutions = evolutions.reduce<IPokemonEvolution[]>(
    (acc, current) => {
      const x = acc.find((item) => item.id === current.id);
      if (!x) {
        return [...acc, current];
      } else {
        return acc;
      }
    },
    []
  );
  return uniqueEvolutions;
};

const PokemonEvolutionList: React.FC<PokemonEvolutionListProps> = ({
  pokemonId,
}) => {
  const [evolutionChain, setEvolutionChain] = useState<IPokemonEvolution[]>([]);

  useEffect(() => {
    const loadEvolutions = async () => {
      if (LOGGING_ENABLED) {
        console.log(`Fetching evolutions for Pokémon ID: ${pokemonId}`);
      }
      try {
        const evolutions = await fetchEvolutions(pokemonId);
        const uniqueEvolutions = removeDuplicates(evolutions);
        setEvolutionChain(uniqueEvolutions);
        if (LOGGING_ENABLED) {
          console.log(`Evolutions fetched successfully:`, uniqueEvolutions);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Error fetching evolutions: ${err.message}`);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    loadEvolutions();
  }, [pokemonId]);

  return (
    <>
      <div className="top-bar-evo">
        <h2 className={`${pokemonFont.className} ${styles.subtile}`}>
          Evolutions
        </h2>
      </div>

      <div className={`${styles.pokemons}`}>
        <motion.section
          className={styles.pokemons}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {evolutionChain.map((evolution) => (
            <motion.div
              key={evolution.id}
              className={`${styles.imageContainerEvo}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/pokemon/${evolution.id}`}>
                <PokemonEvolutionPicture
                  pokemonsEvo={[evolution]}
                  isMainPage={true}
                />
              </Link>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </>
  );
};

export default PokemonEvolutionList;
