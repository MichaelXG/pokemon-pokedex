"use client";

import { ReactNode } from "react";

import { PokemonProvider } from "@/context/pokemonContext";

export function Providers({ children }: { children: ReactNode }) {
  return <PokemonProvider>{children}</PokemonProvider>;
}
