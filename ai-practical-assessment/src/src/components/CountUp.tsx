import { useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
}

/** Animated number counter for dashboard stat cards. */
export function CountUp({ value }: CountUpProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(spring, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <>{display}</>;
}
