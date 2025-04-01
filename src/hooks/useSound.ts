import { useCallback } from "react";

export const useSound = (filepath: string) => {
  const playSound = useCallback(() => {
    const audio = new Audio(filepath);
    audio.play().catch((error) => {
      console.warn("Failed to play sound:", error);
    });
  }, [filepath]);

  return playSound;
};

export const usePowerOnSound = () => {
  return useSound("/turning-on.mp3");
};

export const usePowerOffSound = () => {
  return useSound("/turning-off.mp3");
};

export default useSound;
