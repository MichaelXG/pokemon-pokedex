import Image from "next/image";
import Link from "next/link";

import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Ir para a página inicial">
        <Image
          src="/pokemon-logo.svg"
          alt="Pokémon"
          width={200}
          height={60}
          priority
          className={styles.logo}
        />
      </Link>
    </header>
  );
}
