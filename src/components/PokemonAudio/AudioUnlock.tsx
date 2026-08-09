"use client";

import { useEffect } from "react";

import { armAudioUnlock } from "./pokemonAudio";

export default function AudioUnlock() {
  useEffect(() => {
    armAudioUnlock();
  }, []);

  return null;
}
