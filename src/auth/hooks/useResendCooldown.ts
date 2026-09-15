"use client";

import { useCallback, useEffect, useState } from "react";

export function useResendCooldown(cooldownSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const startCooldown = useCallback(() => {
    setSecondsLeft(cooldownSeconds);
  }, [cooldownSeconds]);

  const canResend = secondsLeft === 0;

  return { secondsLeft, canResend, startCooldown };
}
