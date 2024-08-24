"use client";

import Carousel from "@/components/PokemonCarouselDetails";
import Loader from "@/app/Loader";
import usePokemon from "@/hooks/usePokemon";

export default function PokemonPage({ params }: { params: { id: number } }) {
  const { pokemonData, loading, error } = usePokemon();
  const activeId = Number(params.id); // Converta o activeId para um número

  if (loading) {
    return <Loader />;
  }
  if (error) return <div>{error}</div>;

  return <Carousel activeId={activeId} pokemons={pokemonData} />;
}
