"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import PokemonEvolutionPicture from "../PokemonEvolutioPicture";

import styles from "./pokemonEvolutionList.module.scss";

import { IPokemonEvolution } from "@/interfaces/IPokemon";
import { fetchEvolutions } from "@/lib/pokemonClient";

interface PokemonEvolutionListProps {
  pokemonId: number;
}

export default function PokemonEvolutionList({
  pokemonId,
}: PokemonEvolutionListProps) {
  const [evolutionChain, setEvolutionChain] = useState<IPokemonEvolution[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadEvolutions = async () => {
      try {
        const evolutions = await fetchEvolutions(pokemonId);
        if (!cancelled) setEvolutionChain(evolutions);
      } catch {
        if (!cancelled) setEvolutionChain([]);
      }
    };

    void loadEvolutions();
    return () => {
      cancelled = true;
    };
  }, [pokemonId]);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Evoluções</h2>
      {evolutionChain.length === 0 ? (
        <p className={styles.muted}>Nenhuma evolução encontrada.</p>
      ) : (
        <motion.div
          className={styles.row}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {evolutionChain.map((evolution, index) => (
            <div key={evolution.id} className={styles.step}>
              {index > 0 ? (
                <span className={styles.arrow} aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
              <Link
                href={`/pokemon/${evolution.id}`}
                className={styles.item}
                aria-label={`${evolution.name}, número ${evolution.id}`}
              >
                <PokemonEvolutionPicture pokemon={evolution} />
              </Link>
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
