import type { CSSProperties } from "react";
import Image from "next/image";

import TypeIcon from "@/components/TypeIcon";
import { formatId, formatName } from "@/utils/globalUtils";
import { getTypeColor } from "@/utils/typeUtils";
import styles from "@/components/PokemonEvolutioPicture/pokemonEvolutionPicture.module.scss";
import { IPokemonEvolution } from "@/interfaces/IPokemon";

interface PokemonEvolutionPictureProps {
  pokemon: IPokemonEvolution;
}

export default function PokemonEvolutionPicture({
  pokemon,
}: PokemonEvolutionPictureProps) {
  const artwork = pokemon.image || "/pokemon-logo.svg";
  const primaryType = pokemon.types[0]?.type.name || "normal";

  return (
    <div
      className={styles.card}
      style={{ "--type-color": getTypeColor(primaryType) } as CSSProperties}
    >
      <div className={styles.hero}>
        <span className={styles.number}>#{formatId(pokemon.id)}</span>
        <div className={styles.artwork}>
          <Image
            src={artwork}
            alt={formatName(pokemon.name)}
            width={180}
            height={180}
            quality={80}
            className={styles.image}
          />
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{formatName(pokemon.name)}</h3>
        <div className={styles.types}>
          {pokemon.types?.length > 0 ? (
            pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={styles.typeIcon}
                style={{ backgroundColor: getTypeColor(type.type.name) }}
                title={formatName(type.type.name)}
              >
                <TypeIcon typeName={type.type.name} size={22} />
              </span>
            ))
          ) : (
            <span className={styles.empty}>—</span>
          )}
        </div>
      </div>
    </div>
  );
}
