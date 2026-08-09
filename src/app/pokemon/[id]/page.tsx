import type { Metadata } from "next";

import Carousel from "@/components/PokemonCarouselDetails";
import { formatId } from "@/utils/globalUtils";

type PokemonPageProps = {
  params: { id: string };
};

export function generateMetadata({ params }: PokemonPageProps): Metadata {
  return {
    title: `Pokémon N-${formatId(Number(params.id))}`,
  };
}

export default function PokemonPage({ params }: PokemonPageProps) {
  const activeId = Number(params.id);

  if (!Number.isFinite(activeId) || activeId < 1) {
    return <div>Pokémon não encontrado.</div>;
  }

  return <Carousel activeId={activeId} />;
}
