import { NextResponse } from "next/server";

import { getSpeciesCount } from "@/lib/pokeapi";

export const revalidate = 86400;

export async function GET() {
  try {
    const count = await getSpeciesCount();
    return NextResponse.json({ count, minId: 1 });
  } catch {
    return NextResponse.json({ message: "Failed to load dex meta" }, { status: 502 });
  }
}
