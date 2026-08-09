"use client";

import Image from "next/image";

import TypeIcon from "@/components/TypeIcon";
import styles from "@/components/PokemonPicture/pokemonPicture.module.scss";
import { pokemonFont } from "@/fonts";
import { IPokemon } from "@/interfaces/IPokemon";
import { formatId, formatName } from "@/utils/globalUtils";

interface PokemonPictureProps {
  pokemon: IPokemon;
  isMainPage: boolean;
  clickedId?: number;
  size?: number;
}

export default function PokemonPicture({
  pokemon,
  isMainPage,
  clickedId,
  size = 200,
}: PokemonPictureProps) {
  const frontDefault =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    "/pokemon-logo.svg";

  const imageClass =
    clickedId && pokemon.id === clickedId ? styles.clicked : "";
  const sizeClass = isMainPage ? styles.mainPageSize : "";

  return (
    <div className={`${styles.imageContainer} ${sizeClass}`}>
      <Image
        src={frontDefault}
        alt={pokemon.name || "Pokémon"}
        width={size}
        height={size}
        quality={80}
        className={imageClass}
      />

      {isMainPage && (
        <div className={styles.infoContainer}>
          <p className={`${styles.pokemonNumber} ${pokemonFont.className}`}>
            N-{formatId(pokemon.id)}
          </p>
          <p className={`${styles.pokemonName} ${pokemonFont.className}`}>
            {formatName(pokemon.name)}
          </p>
          <div className={styles.pokemonTypes}>
            {pokemon.types?.length > 0 ? (
              pokemon.types.map((type) => (
                <TypeIcon key={type.type.name} typeName={type.type.name} />
              ))
            ) : (
              <span className={styles.type}>Not available</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
