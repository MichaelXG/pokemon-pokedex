"use client";

import Image from "next/image";

import { getTypeBackgroundUrl } from "@/utils/typeUtils";
import styles from "@/components/PokemonPicture/pokemonPicture.module.scss";
import { pokemonFont } from "@/fonts";
import { IPokemon } from "@/interfaces/IPokemon";
import { formatId, formatName, LOGGING_ENABLED } from "@/utils/globalUtils";

interface PokemonPictureProps {
  pokemon: IPokemon;
  isMainPage: boolean;
  clickedId?: number; // Parâmetro opcional para identificar o Pokémon clicado
}

export default function PokemonPicture({
  pokemon,
  isMainPage,
  clickedId, // Recebe o ID clicado como parâmetro opcional
}: PokemonPictureProps) {
  // Obtém a URL da imagem oficial do Pokémon ou uma imagem padrão se não estiver disponível
  const frontDefault =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    "/default-image.png";

  // Log para verificar os sprites do Pokémon e a URL da imagem
  if (LOGGING_ENABLED) {
    console.log("Pokemon sprites:", pokemon.sprites);
    console.log("Image URL:", frontDefault);
  }

  // Define uma classe CSS especial se o Pokémon for o que foi clicado
  const imageClass =
    clickedId && pokemon.id === clickedId ? styles.clicked : "";

  // Define o tamanho da imagem com base na página (principal ou detalhe)
  const sizeClass = isMainPage ? styles.mainPageSize : "";

  return (
    <div className={`${styles.imageContainer} ${sizeClass}`}>
      <Image
        src={frontDefault} // URL da imagem do Pokémon
        alt={pokemon.name || "Pokémon"} // Texto alternativo se a imagem não carregar
        layout="responsive" // Layout responsivo
        width={200} // Largura da imagem
        height={200} // Altura da imagem
        quality={80} // Qualidade da imagem
        onError={(e) => {
          // Log para erros de carregamento da imagem
          if (LOGGING_ENABLED) {
            console.log("Error loading image:", e);
          }
        }}
        className={`${imageClass}`} // Aplica a classe especial se o Pokémon foi clicado
      />

      {isMainPage && ( // Exibe informações adicionais somente na página principal
        <div className={styles.infoContainer}>
          <p className={`${styles.pokemonNumber} ${pokemonFont.className}`}>
            N-{formatId(pokemon.id)} {/* Formata e exibe o ID do Pokémon */}
          </p>
          <p className={`${styles.pokemonName} ${pokemonFont.className}`}>
            {formatName(pokemon.name)} {/* Formata e exibe o nome do Pokémon */}
          </p>
          <div className={styles.pokemonTypes}>
            {pokemon.types && pokemon.types.length > 0 ? (
              // Mapeia e exibe os tipos do Pokémon
              pokemon.types.map((type, index) => {
                const typeName = type.type.name; // Nome do tipo do Pokémon
                const backgroundUrl = getTypeBackgroundUrl(typeName); // Obtém a URL do fundo baseado no tipo
                return (
                  <span
                    key={index}
                    title={typeName} // Exibe o nome do tipo como dica
                    // className={styles.type} // Aplica estilo ao tipo
                    style={{
                      backgroundImage: `url(${backgroundUrl})`, // Define a imagem de fundo
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      width: "24px", // Largura do ícone do tipo
                      height: "24px", // Altura do ícone do tipo
                      display: "inline-block",
                      margin: "0 5px",
                    }}
                  />
                );
              })
            ) : (
              <span className={styles.type}>Not available</span> // Exibe mensagem se os tipos não estiverem disponíveis
            )}
          </div>
        </div>
      )}
    </div>
  );
}
