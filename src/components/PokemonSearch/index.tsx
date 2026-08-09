"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";

import styles from "./pokemonSearch.module.scss";

interface PokemonSearchProps {
  hasNoResults: boolean;
  onSearch: (term: string) => void;
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({
  hasNoResults,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "/" && event.target instanceof HTMLElement) {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
          return;
        }
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setSearchTerm("");
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="pokemon-search">
        Buscar Pokémon
      </label>
      <div className={`${styles.field} ${hasNoResults ? styles.error : ""}`}>
        <svg
          className={styles.icon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path
            d="M20 20L16.5 16.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="pokemon-search"
          type="search"
          ref={inputRef}
          className={styles.searchInput}
          placeholder="Buscar por nome, número ou tipo"
          value={searchTerm}
          onChange={handleInputChange}
          autoComplete="off"
        />
        {searchTerm ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setSearchTerm("")}
            aria-label="Limpar busca"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default PokemonSearch;
