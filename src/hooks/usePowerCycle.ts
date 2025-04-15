import { useState, useCallback } from "react";

import { usePowerOnSound, usePowerOffSound } from "~/hooks/useSound";

export type CrtPowerState = "off" | "on" | "turning-on" | "turning-off";

export function usePowerCycle() {
  const playPowerOnSound = usePowerOnSound();
  const playPowerOffSound = usePowerOffSound();
  const [powerState, setPowerState] = useState<CrtPowerState>("off");

  const onPowerOn = useCallback(() => {
    if (powerState === "turning-off") {
      setPowerState("turning-on");
    } else if (powerState === "off") {
      setPowerState("turning-on");
    } else {
      return;
    }
    playPowerOnSound();

    // Set to fully on after animation
    setTimeout(() => {
      setPowerState("on");
    }, 1500);
  }, [powerState, playPowerOnSound]);

  const onPowerOff = useCallback(() => {
    if (powerState === "turning-on") {
      setPowerState("turning-off");
    } else if (powerState === "on") {
      setPowerState("turning-off");
    } else {
      return;
    }
    playPowerOffSound();

    // Set to fully off after animation
    setTimeout(() => {
      setPowerState("off");
    }, 600);
  }, [powerState, playPowerOffSound]);

  const isOn = powerState === "on";
  const isOff = powerState === "off";
  const isTurningOn = powerState === "turning-on";
  const isTurningOff = powerState === "turning-off";

  return {
    powerState,
    onPowerOn,
    onPowerOff,
    isOn,
    isOff,
    isTurningOn,
    isTurningOff,
  };
}
