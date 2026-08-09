import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CRY_BASE =
  "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ message: "Invalid Pokémon id" }, { status: 400 });
  }

  const urls = [
    `${CRY_BASE}/latest/${id}.ogg`,
    `${CRY_BASE}/legacy/${id}.ogg`,
  ];

  for (const url of urls) {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) continue;

    const audio = await response.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/ogg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return NextResponse.json({ message: "Cry not found" }, { status: 404 });
}
