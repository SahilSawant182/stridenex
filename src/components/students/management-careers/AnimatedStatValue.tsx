"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type AnimatedStatValueProps = {
  value: string;
};

export default function AnimatedStatValue({
  value,
}: AnimatedStatValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState<number | null>(null);
  const parts = useMemo(() => value.split(/(\d+(?:\.\d+)?)/g), [value]);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const controls = animate(0, 1, {
      duration: 1.25,
      ease: "easeOut",
      onUpdate: setProgress,
    });

    return () => controls.stop();
  }, [isInView, reduceMotion]);
  const visibleProgress =
    reduceMotion || !isInView ? 1 : (progress ?? 0);

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{value}</span>
      {parts.map((part, index) =>
        /^\d+(?:\.\d+)?$/.test(part) ? (
          <span key={index} aria-hidden="true">
            {(Number(part) * visibleProgress).toFixed(
              part.includes(".") ? part.length - part.indexOf(".") - 1 : 0,
            )}
          </span>
        ) : (
          <span key={index} aria-hidden="true">
            {part}
          </span>
        ),
      )}
    </span>
  );
}
