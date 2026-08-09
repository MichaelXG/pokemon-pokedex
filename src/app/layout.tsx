import type { Metadata } from "next";

import { Providers } from "./providers";

import Header from "@/components/Header";
import AudioUnlock from "@/components/PokemonAudio/AudioUnlock";

import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "Pokémon Pokédex",
    template: "%s | Pokémon Pokédex",
  },
  description:
    "Pokédex interativa com React, Next.js 13 e Framer Motion, usando a PokéAPI.",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="gradient-background">
        <Providers>
          <AudioUnlock />
          <div className="app-shell">
            <Header />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
