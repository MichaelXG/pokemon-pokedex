"use client";

import React from "react";

import PokemonsList from "../components/PokemonList";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <PokemonsList />{" "}
    </main>
  );
}
