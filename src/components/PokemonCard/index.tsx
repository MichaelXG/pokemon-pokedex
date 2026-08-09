import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "@/components/PokemonCard/pokemonCard.module.scss";
import TypeIcon from "@/components/TypeIcon";
import { IPokemon } from "@/interfaces/IPokemon";
import { formatId, formatName } from "@/utils/globalUtils";
import { getTypeColor } from "@/utils/typeUtils";

interface PokemonCardProps {
  pokemon: IPokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const artwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    "/pokemon-logo.svg";
  const primaryType = pokemon.types[0]?.type.name || "normal";

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className={styles.card}
      style={{ "--type-color": getTypeColor(primaryType) } as CSSProperties}
      aria-label={`${formatName(pokemon.name)}, número ${formatId(pokemon.id)}, tipos ${pokemon.types.map((entry) => formatName(entry.type.name)).join(" e ")}`}
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
        <h2 className={styles.name}>{formatName(pokemon.name)}</h2>
        <div className={styles.types}>
          {pokemon.types.map((entry) => (
            <span
              key={entry.type.name}
              className={styles.typeIcon}
              style={{ backgroundColor: getTypeColor(entry.type.name) }}
              title={formatName(entry.type.name)}
              aria-hidden
            >
              <TypeIcon typeName={entry.type.name} size={22} />
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return <div className={styles.skeleton} aria-hidden />;
}
