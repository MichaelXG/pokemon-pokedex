import { NextRequest, NextResponse } from "next/server";

import { queryPokemonPage } from "@/lib/pokeapi";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || 12);
    const q = request.nextUrl.searchParams.get("q") || "";

    const data = await queryPokemonPage({ page, limit, q });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 502 });
  }
}
