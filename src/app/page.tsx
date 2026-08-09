import PokemonsList from "../components/PokemonList";

import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.main}>
      <PokemonsList />
    </div>
  );
}
