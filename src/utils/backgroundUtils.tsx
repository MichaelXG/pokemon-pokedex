import React, { FC, ReactNode } from "react";
import styled from "styled-components";

const typeColors: { [key: string]: string } = {
  normal: "linear-gradient(to right, #D0D0A1, #A8A77A)",
  fire: "linear-gradient(to right, #F7BFA0, #EE8130)",
  water: "linear-gradient(to right, #9FC2FF, #6390F0)",
  electric: "linear-gradient(to right, #F9E29D, #F7D02C)",
  grass: "linear-gradient(to right, #A9D2A4, #7AC74C)",
  ice: "linear-gradient(to right, #C2E3E4, #96D9D6)",
  fighting: "linear-gradient(to right, #E67D6D, #C22E28)",
  poison: "linear-gradient(to right, #D585D4, #A33EA1)",
  ground: "linear-gradient(to right, #F2D1A8, #E2BF65)",
  flying: "linear-gradient(to right, #C2A9F5, #A98FF3)",
  psychic: "linear-gradient(to right, #FAD0D3, #F95587)",
  bug: "linear-gradient(to right, #D0E07B, #A6B91A)",
  rock: "linear-gradient(to right, #E4CBA0, #B6A136)",
  ghost: "linear-gradient(to right, #8A6F9C, #735797)",
  dragon: "linear-gradient(to right, #8D6BFC, #6F35FC)",
  dark: "linear-gradient(to right, #8C6C53, #705746)",
  steel: "linear-gradient(to right, #D0D0D0, #B7B7CE)",
  fairy: "linear-gradient(to right, #F2B2B2, #D685AD)",
};

interface BackgroundProps {
  type: string;
}

const Background = styled.div<BackgroundProps>`
  background: ${({ type }) => typeColors[type] || "#FFFFFF"};
  min-height: 100vh;
  padding: 20px;
`;

interface PokemonBackgroundProps {
  type: string;
  children?: ReactNode;
}

const PokemonBackground: FC<PokemonBackgroundProps> = ({ type, children }) => {
  return <Background type={type}>{children}</Background>;
};

export default PokemonBackground;
