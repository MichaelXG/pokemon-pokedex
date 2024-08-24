"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import Script from "next/script";

import styles from "./PokemonSearch.module.scss";

interface PokemonSearchProps {
  hasNoResults: boolean;
  onSearch: (term: string) => void;
}

const PokemonSearch: React.FC<PokemonSearchProps> = ({
  hasNoResults,
  onSearch,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleEscKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchTerm("");
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [isExpanded]);

  const handleExpandClick = () => setIsExpanded(true);

  const handleCloseClick = () => {
    setIsExpanded(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Script
        src="https://cdn.lordicon.com/lordicon.js"
        strategy="lazyOnload"
      />
      <div className={styles.container}>
        {isExpanded ? (
          <div className={styles.searchExpanded}>
            <input
              type="text"
              ref={inputRef}
              className={`${styles.searchInput} ${
                hasNoResults ? styles.error : ""
              }`}
              placeholder="Search Pokémon by ID, name or type"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <lord-icon
              src="https://cdn.lordicon.com/pagmnkiz.json"
              trigger="click"
              stroke="bold"
              state="morph-cross-reverse"
              colors="primary:#ffffff,secondary:#b4b4b4"
              style={{ width: "30px", height: "30px" }}
              onClick={handleCloseClick}
              className={styles.iconeFechar}
            />
          </div>
        ) : (
          <lord-icon
            src="https://cdn.lordicon.com/pagmnkiz.json"
            trigger="morph"
            stroke="bold"
            state="loop-spin"
            colors="primary:#ffffff,secondary:#b4b4b4"
            style={{ width: "30px", height: "30px" }}
            onClick={handleExpandClick}
            className={styles.iconeBusca}
          />
        )}
      </div>
    </>
  );
};

export default PokemonSearch;
