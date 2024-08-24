"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Quicksand } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import styles from "../PokemonCarouselDetails/pokemonCarouselDetails.module.scss";
import { playAudio, playTransitionAudio } from "../PokemonAudio/pokemonAudio";
import PokemonEvolutionList from "../PokemonEvolutionList";
import PokemonStatsChart from "../PokemonStatsChart";
import PokemonPicture from "../PokemonPicture";

import {
  FEMALE_IMAGE,
  formatName,
  LOGGING_ENABLED,
  MALE_IMAGE,
} from "@/utils/globalUtils";
import { IPokemon } from "@/interfaces/IPokemon";
import { pokemonFont } from "@/fonts";
import { formatId } from "@/utils/globalUtils";
import { getTypeBackgroundUrl } from "@/utils/typeUtils";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Enum para posições do carrossel
enum enPosition {
  FRONT = 1,
  MIDDLE = 0,
  BACK = 2,
}

// Props interface for the Carousel component
interface IProps {
  activeId: number;
  pokemons: IPokemon[];
}

// Carousel component
export default function Carousel({ activeId, pokemons }: IProps) {
  if (LOGGING_ENABLED) {
    console.log("Active ID:", activeId);
  }

  const [visibleItems, setVisibleItems] = useState<IPokemon[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [startInteractionPosition, setStartInteractionPosition] =
    useState<number>(0);

  const [typeImagesExist, setTypeImagesExist] = useState<
    Record<string, boolean>
  >({});
  const [weaknessImagesExist, setWeaknessImagesExist] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (pokemons.length > 0 && activeIndex !== null) {
      const currentPokemon = pokemons[activeIndex];
      if (currentPokemon) {
        <Link href={`/pokemon/${currentPokemon}`} />;
      }
    }
  }, [activeIndex, pokemons]);

  // Effect to initialize the active index and start interaction position
  useEffect(() => {
    if (pokemons.length > 0) {
      const index = pokemons.findIndex((pokemon) => pokemon.id === activeId);

      if (index !== -1) {
        setActiveIndex(index);
        setStartInteractionPosition(index * 300);
      } else {
        setActiveIndex(0);
        setStartInteractionPosition(0);
      }

      if (LOGGING_ENABLED) {
        console.log("Active Pokémon index:", index);
        console.log(
          "Start interaction position set to:",
          startInteractionPosition
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemons, activeId]); // Nâo colocar o startInteractionPosition aqui

  // Effect to update visible items based on the active index
  useEffect(() => {
    if (pokemons.length > 0) {
      const indexInArrayScope =
        ((activeIndex % pokemons.length) + pokemons.length) % pokemons.length;
      const newVisibleItems = [...pokemons, ...pokemons].slice(
        indexInArrayScope,
        indexInArrayScope + 3
      );
      setVisibleItems(newVisibleItems);

      if (LOGGING_ENABLED) {
        console.log("Visible items:", newVisibleItems);
      }
    }
  }, [pokemons, activeIndex]);

  // Effect to add a class to the HTML element for styling
  useEffect(() => {
    const htmlEl = document.querySelector("html");
    if (htmlEl) {
      htmlEl.classList.add("pokemon-page");

      return () => {
        htmlEl.classList.remove("pokemon-page");
      };
    }
  }, []);

  // Effect to play audio when visible items change
  useEffect(() => {
    if (visibleItems.length > 0) {
      const middlePokemon = visibleItems[enPosition.MIDDLE];

      if (middlePokemon && middlePokemon.id === pokemons[activeIndex].id) {
        playTransitionAudio();
        playAudio(middlePokemon.id);

        if (LOGGING_ENABLED) {
          console.log(
            "Playing transition audio and voice for:",
            middlePokemon.id
          );
        }
      }

      if (LOGGING_ENABLED) {
        console.log("Current visible items:", visibleItems);
      }
    }
  }, [visibleItems, activeIndex, pokemons]);

  // Handler to change the active index based on direction
  const handleChangeActiveIndex = (newDirection: number) => {
    setActiveIndex((prevActiveIndex) => {
      const newIndex =
        (prevActiveIndex + newDirection + pokemons.length) % pokemons.length;
      return newIndex;
    });
  };

  // Handler for drag start event
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setStartInteractionPosition(e.clientX);

    if (LOGGING_ENABLED) {
      console.log("Drag started at position:", e.clientX);
    }
  };

  // Handler for drag end event
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (startInteractionPosition) {
      rotateCarousel(e.clientX);

      if (LOGGING_ENABLED) {
        console.log("Drag ended at position:", e.clientX);
      }
    }
  };

  // Handler for touch start event
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartInteractionPosition(e.touches[0].clientX);

    if (LOGGING_ENABLED) {
      console.log("Touch started at position:", e.touches[0].clientX);
    }
  };

  // Handler for touch end event
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startInteractionPosition) {
      rotateCarousel(e.changedTouches[0].clientX);

      if (LOGGING_ENABLED) {
        console.log("Touch ended at position:", e.changedTouches[0].clientX);
      }
    }
  };

  // Function to rotate the carousel based on clientX position
  const rotateCarousel = (clientX: number) => {
    const diffPosition = clientX - startInteractionPosition;
    const newPosition = diffPosition > 0 ? -1 : 1;
    handleChangeActiveIndex(newPosition);

    if (LOGGING_ENABLED) {
      console.log("Rotated carousel by difference in position:", diffPosition);
    }
  };

  // Display a message if no Pokémon data is available
  if (visibleItems.length === 0) {
    return <div>No Pokémon data available.</div>;
  }

  // Find the current Pokémon to display details
  const currentPokemon = pokemons[activeIndex];

  const statsData = {
    labels: currentPokemon.stats.map((stat) => stat.stat.name),
    datasets: [
      {
        label: "Stats",
        data: currentPokemon.stats.map((stat) => stat.base_stat),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true, // Permite que o gráfico seja responsivo
    maintainAspectRatio: false, // Permite que o gráfico se adapte ao tamanho do container
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  const checkImages = async () => {
    const typeChecks = await Promise.all(
      currentPokemon.types.map(async (type) => {
        const url = getTypeBackgroundUrl(type.type.name);
        return {
          [type.type.name]: await fetch(url).then((response) => response.ok),
        };
      })
    );
    setTypeImagesExist(Object.assign({}, ...typeChecks));

    const weaknessChecks = await Promise.all(
      currentPokemon.weaknesses.map(async (weakness) => {
        const url = getTypeBackgroundUrl(weakness);
        return {
          [weakness]: await fetch(url).then((response) => response.ok),
        };
      })
    );
    setWeaknessImagesExist(Object.assign({}, ...weaknessChecks));
  };

  checkImages();

  return (
    <>
      <div className="top-bar">
        <div className={`${quicksand.className}`}>
          <h1 className={`${pokemonFont.className} ${styles.title}`}>
            {formatName(currentPokemon.name)} (N-{formatId(currentPokemon.id)})
          </h1>
        </div>
      </div>

      <div className={`content`}>
        <div className="grid-carousel-details">
          <div className="grid-carousel">
            <div
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="popLayout">
                {visibleItems.map((item, position) =>
                  item.id ? (
                    <motion.div
                      key={item.id}
                      className={styles.pokemon}
                      transition={{ duration: 0.8 }}
                      initial={{
                        x: -1500,
                        scale: 0.75,
                      }}
                      animate={{ x: 0, ...getItemStyles(position) }}
                      exit={{
                        x: 0,
                        left: "-20%",
                        opacity: 0,
                        scale: 1,
                      }}
                    >
                      <Link href={`/pokemon/${item.id}`}>
                        <PokemonPicture pokemon={item} isMainPage={false} />
                      </Link>
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="grid-details">
            {/* Description */}
            <div className={styles.details}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.subtitle}>Description</td>
                    <td>{currentPokemon.description || "Not available"}</td>
                  </tr>
                </tbody>
              </table>
            </div>{" "}
            {/* Informations */}
            <div className={styles.details}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.subtitle}>Height</td>
                    <td>
                      {currentPokemon.height
                        ? `${(currentPokemon.height / 10).toFixed(2)} m`
                        : "Not available"}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.subtitle}>Weight</td>
                    <td>
                      {currentPokemon.weight
                        ? `${(currentPokemon.weight / 10).toFixed(2)} kg`
                        : "Not available"}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.subtitle}>Category</td>
                    {currentPokemon.category ? (
                      <td
                        title={currentPokemon.category}
                        // className={styles.type}
                        style={{
                          backgroundImage: typeImagesExist[
                            currentPokemon.category
                          ]
                            ? `url(${getTypeBackgroundUrl(
                                currentPokemon.category
                              )})`
                            : "none",
                          height: "35px",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {!typeImagesExist[currentPokemon.category] && (
                          <td>{currentPokemon.category}</td>
                        )}
                      </td>
                    ) : (
                      <td className={styles.label}>Not available</td>
                    )}
                  </tr>
                  <tr>
                    <td className={styles.subtitle}>Abilities</td>
                    <td>
                      {currentPokemon.abilities.length > 0
                        ? currentPokemon.abilities
                            .map((ability) => ability.ability.name)
                            .join(", ")
                        : "Not available"}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.subtitle}>Gender</td>
                    <td>
                      <div className={styles.genderRates}>
                        <div>
                          <Image
                            src={MALE_IMAGE}
                            alt="Male Icon"
                            width={85}
                            height={85}
                            // className={styles.maleIcon}
                          />
                          <td>
                            {currentPokemon.gender?.male || "Not available"}
                          </td>
                        </div>
                        <div>
                          <Image
                            src={FEMALE_IMAGE}
                            alt="Female Icon"
                            width={85}
                            height={85}
                            // className={`${styles.genderIcon} ${styles.femaleIcon}`}
                          />
                          <span>
                            {currentPokemon.gender?.female || "Not available"}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Types */}
            <div className={styles.details}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.subtitle}>Types</td>
                    <td>
                      <ul>
                        {currentPokemon.types.length > 0 ? (
                          currentPokemon.types.map((type, index) => {
                            const typeName = type.type.name;
                            const backgroundUrl =
                              getTypeBackgroundUrl(typeName);
                            return (
                              <td
                                key={index}
                                title={typeName}
                                className={styles.type}
                                style={{
                                  backgroundImage: typeImagesExist[typeName]
                                    ? `url(${backgroundUrl})`
                                    : "none",
                                  display: "inline-block",
                                  width: "35px",
                                  height: "35px",
                                  backgroundSize: "contain",
                                  backgroundRepeat: "no-repeat",
                                  margin: "0 5px",
                                }}
                              >
                                {!typeImagesExist[typeName] && (
                                  <td>{typeName}</td>
                                )}
                              </td>
                            );
                          })
                        ) : (
                          <span className={styles.label}>Not available</span>
                        )}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Weaknesses */}
            <div className={styles.details}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.subtitle}>Weaknesses</td>
                    <td>
                      <ul>
                        {currentPokemon.weaknesses.length > 0 ? (
                          currentPokemon.weaknesses.map((weakness, index) => {
                            const backgroundUrl =
                              getTypeBackgroundUrl(weakness);
                            return (
                              <td
                                key={index}
                                title={weakness}
                                className={styles.type}
                                style={{
                                  backgroundImage: weaknessImagesExist[weakness]
                                    ? `url(${backgroundUrl})`
                                    : "none",
                                  display: "inline-block",
                                  width: "35px",
                                  height: "35px",
                                  backgroundSize: "contain",
                                  backgroundRepeat: "no-repeat",
                                  margin: "0 5px",
                                }}
                              >
                                {!weaknessImagesExist[weakness] && (
                                  <td>{weakness}</td>
                                )}
                              </td>
                            );
                          })
                        ) : (
                          <span className={styles.type}>Not available</span>
                        )}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-bar-2">
        {/* Chart */}
        <div className={styles.detailsEvo}>
          <div />
          <div className={styles.chartContainer}>
            <PokemonStatsChart data={statsData} options={chartOptions} />
          </div>
          <div />
        </div>

        <div className={styles.details}>
          <p></p>
        </div>

        {/* Evolutions */}
        <div className={styles.detailsEvo}>
          <main className={styles.mainEvo}>
            <PokemonEvolutionList pokemonId={currentPokemon.id} />
          </main>
        </div>
      </div>
    </>
  );
}

// Função para obter estilos de item com base na posição
function getItemStyles(position: enPosition) {
  if (position === enPosition.FRONT) {
    return {
      filter: "blur(10px)",
      scale: 0.5,
      zIndex: 3,
      left: -200,
      top: "-7%",
    };
  }

  if (position === enPosition.MIDDLE) {
    return {
      left: 200,
      scale: 0.5,
      zIndex: 2,
      top: "-7%",
    };
  }

  return {
    filter: "blur(10px)",
    scale: 0.5,
    left: -5,
    opacity: 0.8,
    zIndex: 1,
    top: "-20%",
  };
}
