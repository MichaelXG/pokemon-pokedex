import styles from "./pokemonStatsChart.module.scss";
import { getTypeColor } from "@/utils/typeUtils";
import { IStat } from "@/interfaces/IPokemon";

const LABELS: Record<string, string> = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "At. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidade",
};

const SEGMENTS = 15;
const MAX_STAT = 180;

interface PokemonStatsChartProps {
  stats: IStat[];
  typeName: string;
}

function filledSegments(value: number) {
  return Math.max(0, Math.min(SEGMENTS, Math.round((value / MAX_STAT) * SEGMENTS)));
}

export default function PokemonStatsChart({
  stats,
  typeName,
}: PokemonStatsChartProps) {
  const color = getTypeColor(typeName || "normal");

  return (
    <ul className={styles.stats}>
      {stats.map((stat) => {
        const filled = filledSegments(stat.base_stat);

        return (
          <li key={stat.stat.name} className={styles.stat}>
            <span className={styles.label}>
              {LABELS[stat.stat.name] || stat.stat.name}
            </span>
            <ul className={styles.gauge} aria-hidden>
              {Array.from({ length: SEGMENTS }, (_, index) => {
                const isOn = index >= SEGMENTS - filled;
                return (
                  <li
                    key={index}
                    className={isOn ? styles.on : undefined}
                    style={isOn ? { backgroundColor: color, color } : undefined}
                  />
                );
              })}
            </ul>
            <strong className={styles.value}>{stat.base_stat}</strong>
          </li>
        );
      })}
    </ul>
  );
}
