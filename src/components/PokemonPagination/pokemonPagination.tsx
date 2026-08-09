import { useEffect, useMemo, useState } from "react";

import styles from "./pokemonPagination.module.scss";

interface PokemonPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLastButtons?: boolean;
  hidePrevNextButtons?: boolean;
}

function Chevron({ double = false, direction }: { double?: boolean; direction: "left" | "right" }) {
  const flip = direction === "right" ? styles.flip : undefined;

  return (
    <svg
      className={`${styles.icon} ${flip ?? ""}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {double ? (
        <>
          <path
            d="M11 6L5 12L11 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 6L13 12L19 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <path
          d="M14.5 6L8.5 12L14.5 18"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function buildPages(
  current: number,
  total: number,
  compact: boolean
): Array<number | "ellipsis"> {
  if (total <= (compact ? 5 : 7)) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>(
    compact
      ? [1, total, current - 1, current, current + 1]
      : [1, total, current - 2, current - 1, current, current + 1, current + 2]
  );
  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous && page - previous > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

const PokemonPagination: React.FC<PokemonPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLastButtons = true,
  hidePrevNextButtons = false,
}) => {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 560px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const pages = useMemo(
    () => buildPages(currentPage, totalPages, compact),
    [currentPage, totalPages, compact]
  );

  if (totalPages < 1) return null;

  return (
    <nav className={styles.nav} aria-label="Paginação da Pokédex">
      <span className={styles.srOnly} aria-live="polite">
        Página {currentPage} de {totalPages}
      </span>

      <div className={styles.group}>
        {showFirstLastButtons ? (
          <button
            type="button"
            className={`${styles.button} ${styles.navButton}`}
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Primeira página"
          >
            <Chevron double direction="left" />
          </button>
        ) : null}
        {hidePrevNextButtons ? null : (
          <button
            type="button"
            className={`${styles.button} ${styles.navButton}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <Chevron direction="left" />
          </button>
        )}
      </div>

      <div className={styles.pages}>
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden>
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${styles.button} ${page === currentPage ? styles.active : ""}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Página ${page}`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <div className={styles.group}>
        {hidePrevNextButtons ? null : (
          <button
            type="button"
            className={`${styles.button} ${styles.navButton}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            <Chevron direction="right" />
          </button>
        )}
        {showFirstLastButtons ? (
          <button
            type="button"
            className={`${styles.button} ${styles.navButton}`}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Última página"
          >
            <Chevron double direction="right" />
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default PokemonPagination;
