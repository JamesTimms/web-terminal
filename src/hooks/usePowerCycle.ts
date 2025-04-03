import { useState, useCallback, RefObject } from "react";

import { PowerState } from "~/routes/index";
import { CrtScreenInterface } from "~/components/ui/crt-screen";
import { usePowerOnSound, usePowerOffSound } from "~/hooks/useSound";

export function usePowerCycle(
  crtScreenRef: RefObject<CrtScreenInterface | null>,
) {
  const playPowerOnSound = usePowerOnSound();
  const playPowerOffSound = usePowerOffSound();
  const [powerState, setPowerState] = useState<PowerState>("off");

  const onPowerOn = useCallback(() => {
    if (!crtScreenRef.current) return;
    playPowerOnSound();
    setPowerState("on");
    crtScreenRef.current.powerOn();
    playPowerOnSound();
  }, [crtScreenRef, playPowerOnSound]);

  const onPowerOff = useCallback(() => {
    if (!crtScreenRef.current) return;
    playPowerOffSound();
    crtScreenRef.current.powerOff();
    setPowerState("off");
  }, [crtScreenRef, playPowerOffSound]);

  return {
    powerState,
    onPowerOn,
    onPowerOff,
  };
}
