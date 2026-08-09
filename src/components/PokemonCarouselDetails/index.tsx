"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import styles from "../PokemonCarouselDetails/pokemonCarouselDetails.module.scss";
import { playAudio } from "../PokemonAudio/pokemonAudio";
import PokemonEvolutionList from "../PokemonEvolutionList";
import PokemonPicture from "../PokemonPicture";
import PokemonStatsChart from "../PokemonStatsChart";
import TypeIcon from "../TypeIcon";

import { formatId, formatName } from "@/utils/globalUtils";
import { getTypeColor } from "@/utils/typeUtils";
import { IPokemon } from "@/interfaces/IPokemon";
import { fetchDexMeta, fetchPokemonById } from "@/lib/pokemonClient";
import Loader from "@/app/Loader";

interface IProps {
  activeId: number;
}

function wrapId(id: number, maxId: number) {
  if (maxId < 1) return 1;
  if (id > maxId) return id;
  if (id < 1) return maxId;
  return id;
}

function prettyName(value: string) {
  return value.replace(/-/g, " ");
}

function MaleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="10" cy="14" r="5.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M14.2 9.8L20 4M14.8 4H20v5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FemaleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="12" cy="9" r="5.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M12 14.5v6.5M9 18h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AbilityBoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M13 2 4 14h7l-1 8 10-13h-7l0-7z"
        fill="currentColor"
      />
    </svg>
  );
}

function AbilityEyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  );
}

export default function Carousel({ activeId }: IProps) {
  const router = useRouter();
  const [currentPokemon, setCurrentPokemon] = useState<IPokemon | null>(null);
  const [visibleItems, setVisibleItems] = useState<IPokemon[]>([]);
  const [maxId, setMaxId] = useState(1025);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchDexMeta()
      .then((meta) => {
        if (!cancelled) setMaxId(meta.count);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadNeighbors = async () => {
      setLoading(true);
      try {
        const prevId = wrapId(activeId - 1, maxId);
        const nextId = wrapId(activeId + 1, maxId);
        const [current, prev, next] = await Promise.all([
          fetchPokemonById(activeId),
          fetchPokemonById(prevId),
          fetchPokemonById(nextId),
        ]);
        if (cancelled) return;
        setCurrentPokemon(current);
        setVisibleItems([current, next, prev]);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar este Pokémon.");
          setCurrentPokemon(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadNeighbors();
    return () => {
      cancelled = true;
    };
  }, [activeId, maxId]);

  const currentId = currentPokemon?.id;
  const currentName = currentPokemon?.name;

  useEffect(() => {
    if (!currentId) return;

    const timer = window.setTimeout(() => {
      void playAudio(currentId, currentName);
    }, 120);

    return () => {
      window.clearTimeout(timer);
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, [currentId, currentName]);

  const goTo = (id: number) => {
    router.push(`/pokemon/${wrapId(id, maxId)}`);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (event.key === "ArrowLeft") {
        router.push(`/pokemon/${wrapId(activeId - 1, maxId)}`);
      }
      if (event.key === "ArrowRight") {
        router.push(`/pokemon/${wrapId(activeId + 1, maxId)}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, maxId, router]);

  if (loading && !currentPokemon) {
    return <Loader />;
  }

  if (error || !currentPokemon || visibleItems.length === 0) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || "Pokémon não encontrado."}</p>
        <Link href="/" className={styles.back}>
          ← Pokédex
        </Link>
      </div>
    );
  }

  const genderless =
    currentPokemon.gender?.male === "Genderless" ||
    currentPokemon.gender?.female === "Genderless";
  const prev = visibleItems[2];
  const next = visibleItems[1];

  const finishSwipe = (endX: number) => {
    if (!startX) return;
    const diff = endX - startX;
    if (Math.abs(diff) < 40) return;
    goTo(activeId + (diff > 0 ? -1 : 1));
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarStart}>
          <Link
            href="/"
            className={styles.back}
            aria-label="Voltar à Pokédex"
            title="Voltar à Pokédex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6L9 12L15 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <h1 className={styles.title}>
          {formatName(currentPokemon.name)}{" "}
          <span>#{formatId(currentPokemon.id)}</span>
        </h1>
        <div className={styles.toolbarEnd} aria-hidden />
      </div>

      <div className={styles.mainGrid}>
        <section
          className={styles.carousel}
          onTouchStart={(event) => setStartX(event.touches[0].clientX)}
          onTouchEnd={(event) => finishSwipe(event.changedTouches[0].clientX)}
        >
          <div className={styles.stage}>
            {prev ? (
              <Link
                href={`/pokemon/${prev.id}`}
                className={`${styles.slide} ${styles.side}`}
                aria-label={formatName(prev.name)}
              >
                <PokemonPicture pokemon={prev} isMainPage={false} size={140} />
                <span className={styles.slideName}>{formatName(prev.name)}</span>
              </Link>
            ) : null}

            <motion.div
              key={currentPokemon.id}
              className={`${styles.slide} ${styles.mainSlide}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <PokemonPicture pokemon={currentPokemon} isMainPage={false} size={420} />
            </motion.div>

            {next ? (
              <Link
                href={`/pokemon/${next.id}`}
                className={`${styles.slide} ${styles.side}`}
                aria-label={formatName(next.name)}
              >
                <PokemonPicture pokemon={next} isMainPage={false} size={140} />
                <span className={styles.slideName}>{formatName(next.name)}</span>
              </Link>
            ) : null}
          </div>
        </section>

        <div className={styles.detailsColumn}>
          <article className={`${styles.card} ${styles.aboutCard}`}>
            <div className={styles.cardHeader}>
              <h2>Sobre</h2>
              <div className={styles.typeRow}>
                {currentPokemon.types.map((entry) => (
                  <span
                    key={entry.type.name}
                    className={styles.typeIcon}
                    style={{ backgroundColor: getTypeColor(entry.type.name) }}
                    title={formatName(entry.type.name)}
                    aria-label={formatName(entry.type.name)}
                  >
                    <TypeIcon typeName={entry.type.name} size={28} />
                  </span>
                ))}
              </div>
            </div>

            <p className={styles.description}>
              {currentPokemon.description || "Descrição indisponível."}
            </p>

            <dl className={styles.metrics}>
              <div>
                <dt>Altura</dt>
                <dd>
                  {currentPokemon.height
                    ? `${(currentPokemon.height / 10).toFixed(1)} m`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Peso</dt>
                <dd>
                  {currentPokemon.weight
                    ? `${(currentPokemon.weight / 10).toFixed(1)} kg`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Categoria</dt>
                <dd>{currentPokemon.category || "—"}</dd>
              </div>
            </dl>

            <div className={styles.aboutSplit}>
              <div className={styles.block}>
                <span className={styles.blockLabel}>Habilidades</span>
                <ul className={styles.abilityList}>
                  {currentPokemon.abilities.length > 0 ? (
                    currentPokemon.abilities.map((item) => {
                      const name = formatName(prettyName(item.ability.name));
                      const label = item.is_hidden ? `${name} (oculta)` : name;
                      return (
                        <li key={item.ability.name}>
                          <span
                            className={`${styles.abilityIcon} ${item.is_hidden ? styles.hiddenAbility : ""}`}
                            title={label}
                            aria-label={label}
                          >
                            {item.is_hidden ? <AbilityEyeIcon /> : <AbilityBoltIcon />}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className={styles.muted}>—</li>
                  )}
                </ul>
              </div>

              <div className={styles.block}>
                <span className={styles.blockLabel}>Gênero</span>
                {genderless ? (
                  <strong>Sem gênero</strong>
                ) : (
                  <>
                    <div className={styles.genderMeter}>
                      <span
                        className={`${styles.genderIcon} ${styles.maleIcon}`}
                        title="Macho"
                        aria-label={`Macho ${currentPokemon.gender?.male || ""}`.trim()}
                      >
                        <MaleIcon />
                      </span>
                      <div className={styles.genderBar} aria-hidden>
                        <span
                          className={styles.male}
                          style={{ width: currentPokemon.gender?.male || "0%" }}
                        />
                        <span
                          className={styles.female}
                          style={{ width: currentPokemon.gender?.female || "0%" }}
                        />
                      </div>
                      <span
                        className={`${styles.genderIcon} ${styles.femaleIcon}`}
                        title="Fêmea"
                        aria-label={`Fêmea ${currentPokemon.gender?.female || ""}`.trim()}
                      >
                        <FemaleIcon />
                      </span>
                    </div>
                    <div className={styles.genderLegend}>
                      <span>{currentPokemon.gender?.male || "—"}</span>
                      <span>{currentPokemon.gender?.female || "—"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </article>

          <article className={styles.card}>
            <h2>Fraquezas</h2>
            <div className={styles.typeRow}>
              {currentPokemon.weaknesses.length > 0 ? (
                currentPokemon.weaknesses.map((weakness) => (
                  <span
                    key={weakness}
                    className={styles.typeIcon}
                    style={{ backgroundColor: getTypeColor(weakness) }}
                    title={formatName(weakness)}
                    aria-label={formatName(weakness)}
                  >
                    <TypeIcon typeName={weakness} size={28} />
                  </span>
                ))
              ) : (
                <p className={styles.muted}>Nenhuma fraqueza listada.</p>
              )}
            </div>
          </article>
        </div>
      </div>

      <article className={styles.card}>
        <h2>Estatísticas</h2>
        <PokemonStatsChart
          key={currentPokemon.id}
          stats={currentPokemon.stats}
          typeName={currentPokemon.types[0]?.type.name || "normal"}
        />
      </article>

      <PokemonEvolutionList pokemonId={currentPokemon.id} />
    </div>
  );
}
