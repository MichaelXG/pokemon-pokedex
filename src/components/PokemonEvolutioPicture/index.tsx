import Image from "next/image";

import { pokemonFont } from "@/fonts";
import { formatId, formatName, LOGGING_ENABLED } from "@/utils/globalUtils";
import styles from "@/components/PokemonEvolutioPicture/pokemonEvolutionPicture.module.scss";
import { IPokemonEvolution } from "@/interfaces/IPokemon";
import { getTypeBackgroundUrl } from "@/utils/typeUtils";

interface PokemonEvolutionPictureProps {
  pokemonsEvo: IPokemonEvolution[]; // Lista de Pokémon a serem exibidos
  isMainPage: boolean;
}

export default function PokemonEvolutionPicture({
  pokemonsEvo,
  isMainPage,
}: PokemonEvolutionPictureProps) {
  if (LOGGING_ENABLED) {
    console.log(
      "pokemonsEvo sprites:",
      pokemonsEvo.map((pokemonEvo) => pokemonEvo.image)
    );
  }

  // Define o tamanho da imagem com base na página (principal ou detalhe)
  const sizeClass = isMainPage ? styles.mainPageSize : "";

  return (
    <div className={styles.container}>
      {pokemonsEvo.map((pokemonEvo) => {
        const frontDefault = pokemonEvo.image || "/default-image.png";

        return (
          <div
            key={pokemonEvo.id}
            className={`${styles.imageContainer} ${sizeClass}`}
          >
            <Image
              src={frontDefault}
              alt={pokemonEvo.name || "Pokémon"}
              layout="responsive" // Layout responsivo
              width={200} // Ajuste o tamanho conforme necessário
              height={200} // Ajuste o tamanho conforme necessário
              quality={80} // Ajuste a qualidade conforme necessário
              onError={(e) => {
                if (LOGGING_ENABLED) {
                  console.log("Error loading image:", e);
                }
              }}
              // className={`${imageClass}`} // Aplica a classe especial se o Pokémon foi clicado
            />

            <div className={styles.infoContainer}>
              <p className={`${styles.pokemonNumber} ${pokemonFont.className}`}>
                N-{formatId(pokemonEvo.id)}
              </p>
              <p className={`${styles.pokemonName} ${pokemonFont.className}`}>
                {formatName(pokemonEvo.name)}
              </p>
              <div className={styles.pokemonTypes}>
                {pokemonEvo.types && pokemonEvo.types.length > 0 ? (
                  // Mapeia e exibe os tipos do Pokémon
                  pokemonEvo.types.map((type, index) => {
                    const typeName = type.type.name;
                    const backgroundUrl = getTypeBackgroundUrl(typeName);
                    return (
                      <span
                        key={index}
                        title={typeName}
                        // className={styles.type}
                        style={{
                          backgroundImage: `url(${backgroundUrl})`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          width: "24px", // Ajuste o tamanho conforme necessário
                          height: "24px", // Ajuste o tamanho conforme necessário
                          display: "inline-block",
                          margin: "0 5px",
                        }}
                      />
                    );
                  })
                ) : (
                  <span className={styles.type}>Not available</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
