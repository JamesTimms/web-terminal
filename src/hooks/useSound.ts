import { useCallback } from "react";

const playingSounds = new Map<string, HTMLAudioElement>();

export const useSound = (filepath: string, soundId: string) => {
  const playSound = useCallback(() => {
    const existingSound = playingSounds.get(soundId);
    if (existingSound) {
      existingSound.pause();
      existingSound.currentTime = 0;
      playingSounds.delete(soundId);
    }

    const audio = new Audio(filepath);
    playingSounds.set(soundId, audio);

    audio.play().catch((error) => {
      console.warn("Failed to play sound:", error);
      playingSounds.delete(soundId);
    });

    audio.addEventListener("ended", () => {
      playingSounds.delete(soundId);
    });
  }, [filepath, soundId]);

  return playSound;
};

export const usePowerOnSound = () => {
  return useSound("/turning-on.mp3", "power-on");
};

export const usePowerOffSound = () => {
  return useSound("/turning-off.mp3", "power-off");
};

export default useSound;
