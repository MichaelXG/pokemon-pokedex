"use client";

import "./globals.scss";
import Link from "next/link";
import Image from "next/image";

import { PokemonProvider } from "@/context/PokemonContext";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="pt-BR">
      <head>
        <title>Pokémon</title>
        <meta
          name="description"
          content="Criando um carrossel parallax do Pokémon com React, Next.js 13 e Framer Motion"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="gradient-background">
        <PokemonProvider>
          <div className="grid">
            <header>
              <lord-icon
                src="https://cdn.lordicon.com/hnppcsvw.json"
                trigger="hover"
                stroke="bold"
                colors="primary:#ffffff,secondary:#b4b4b4"
                style={{ width: "50px", height: "50px" }}
                aria-label="Menu"
              />
              <Link href="/">
                <Image
                  src="/pokemon-logo.svg"
                  alt="Pokemon"
                  width={200}
                  height={60}
                />
              </Link>
              <lord-icon
                src="https://cdn.lordicon.com/bgebyztw.json"
                trigger="hover"
                stroke="bold"
                state="hover-looking-around"
                colors="primary:#ffffff,secondary:#b4b4b4"
                style={{ width: "45px", height: "45px" }}
                aria-label="User"
              />
            </header>
            <aside className="sidebar-left" />
            <main>{children}</main>
            <aside className="sidebar-right" />
            <footer />
          </div>
        </PokemonProvider>
      </body>
    </html>
  );
};

export default RootLayout;
