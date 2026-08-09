"use client";

const STORAGE_KEY = "pokedex-audio-ok";

const VOICE_CLIPS: Record<number, string> = {
  1: "/songs/1-bulbasaur.mp3",
  2: "/songs/2-ivysaur.mp3",
  3: "/songs/3-venusaur.mp3",
  4: "/songs/4-charmander.mp3",
  5: "/songs/5-charmeleon.mp3",
  6: "/songs/6-charizard.mp3",
  7: "/songs/7-squirtle.mp3",
  9: "/songs/9-blastoise.mp3",
  10: "/songs/10-caterpie.mp3",
  12: "/songs/12-butterfree.mp3",
  25: "/songs/Pikachu.mp3",
};

let clipAudio: HTMLAudioElement | null = null;
let queued: { id: number; name?: string } | null = null;
let listening = false;

function canPlayNow() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markUnlocked() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore
  }
}

function prettyName(name: string) {
  return name
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stopClip() {
  if (!clipAudio) return;
  clipAudio.pause();
  try {
    clipAudio.currentTime = 0;
  } catch {
    // ignore
  }
}

function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

function speakName(name: string) {
  if (!window.speechSynthesis) return;
  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(prettyName(name));
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.2;
  window.speechSynthesis.speak(utterance);
}

function playClip(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (!clipAudio) clipAudio = new Audio();
    const audio = clipAudio;

    const onPlaying = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("clip failed"));
    };
    const cleanup = () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("error", onError);
    };

    stopClip();
    audio.addEventListener("playing", onPlaying, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.src = src;
    audio.load();
    void audio.play().catch(onError);
  });
}

function flushQueue() {
  if (!queued) return;
  const next = queued;
  queued = null;
  void playAudio(next.id, next.name);
}

export function armAudioUnlock() {
  if (typeof window === "undefined" || listening) return;
  listening = true;

  const unlock = () => {
    markUnlocked();
    flushQueue();
  };

  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
}

export const playAudio = async (id: number, name?: string) => {
  if (typeof window === "undefined" || !id) return;
  armAudioUnlock();

  if (!canPlayNow()) {
    queued = { id, name };
    return;
  }

  stopSpeech();
  const clip = VOICE_CLIPS[id];
  if (clip) {
    try {
      await playClip(clip);
      return;
    } catch {
      stopClip();
    }
  }

  if (name) {
    speakName(name);
    return;
  }

  queued = { id, name };
};

export const playTransitionAudio = () => {
  // Sem som de transição — mascarava a fala do nome.
};

export const playPokemonCry = () => {
  // Gritos da PokéAPI não são fala do nome.
};
