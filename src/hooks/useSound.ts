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
  return useSound("/src/assets/turning-on.mp3");
};
export const usePowerOffSound = () => {
  return useSound("/src/assets/turning-off.mp3");
};
export default useSound;
