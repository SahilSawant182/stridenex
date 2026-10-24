"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "up" | "left" | "right" | "scale";
};

export default function Reveal({
  children,
  className,
  delay = 0,
  animation = "up",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const initial = {
    up: { opacity: 0, y: 24 },
    left: { opacity: 0, x: -24 },
    right: { opacity: 0, x: 24 },
    scale: { opacity: 0, scale: 0.96 },
  }[animation];
  const visible = {
    up: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    scale: { opacity: 1, scale: 1 },
  }[animation];

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : initial}
      whileInView={visible}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}