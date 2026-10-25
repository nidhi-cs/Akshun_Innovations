"use client";

import { motion } from "motion/react";
import type { PropsWithChildren } from "react";

export function AnimatedSection({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
