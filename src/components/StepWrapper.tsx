/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ReactNode } from "react";

interface StepWrapperProps {
  children: ReactNode;
  direction: "next" | "prev";
  key?: string;
}

export default function StepWrapper({ children, direction }: StepWrapperProps) {
  const variants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="w-full max-w-xl mx-auto px-4 py-2 md:px-6 md:py-4 flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}
