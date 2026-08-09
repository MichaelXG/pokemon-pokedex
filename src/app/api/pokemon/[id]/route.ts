import { NextRequest, NextResponse } from "next/server";

import { getPokemonDetails } from "@/lib/pokeapi";

export const revalidate = 86400;

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ message: "Invalid Pokémon id" }, { status: 400 });
  }

  try {
    const pokemon = await getPokemonDetails(id);
    return NextResponse.json(pokemon);
  } catch {
    return NextResponse.json({ message: "Pokémon not found" }, { status: 404 });
  }
}
