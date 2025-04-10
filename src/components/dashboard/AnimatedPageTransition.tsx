
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedPageTransitionProps {
  children: ReactNode;
}

export default function AnimatedPageTransition({ children }: AnimatedPageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
