"use client";

// Verifique se o código está sendo executado no cliente
const isClient = typeof window !== "undefined";

// Crie o objeto de arquivos de áudio apenas no lado do cliente
const pokemonAudioFiles: { [key: number]: HTMLAudioElement } & {
  transition?: HTMLAudioElement;
} = isClient
  ? {
      transition: new Audio("/songs/transition.mp3"),

      1: new Audio("/songs/1-bulbasaur.mp3"),
      2: new Audio("/songs/2-ivysaur.mp3"),
      3: new Audio("/songs/3-venusaur.mp3"),
      4: new Audio("/songs/4-charmander.mp3"),
      5: new Audio("/songs/5-charmeleon.mp3"),
      6: new Audio("/songs/6-charizard.mp3"),
      7: new Audio("/songs/7-squirtle.mp3"),
      8: new Audio("/songs/8-wartortle.mp3"),
      9: new Audio("/songs/9-blastoise.mp3"),
      10: new Audio("/songs/10-caterpie.mp3"),
      11: new Audio("/songs/11-metapod.mp3"),
      12: new Audio("/songs/12-butterfree.mp3"),
    }
  : {}; // No lado do servidor, defina um objeto vazio

export const playAudio = (key: number) => {
  if (isClient && pokemonAudioFiles[key]) {
    pokemonAudioFiles[key].play();
  }
};

export const playTransitionAudio = () => {
  if (isClient && pokemonAudioFiles.transition) {
    pokemonAudioFiles.transition.play();
  }
};
