/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface Step1WelcomeProps {
  onNext: () => void;
}

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div className="text-center space-y-6 py-4">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex justify-center"
      >
        <div className="bg-gold/10 p-4 rounded-full">
          <Sparkles size={48} className="text-gold" />
        </div>
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl tracking-tight leading-tight">
          Build Your Custom <br /> 90-Day Marketing Strategy
        </h1>
        <p className="text-muted text-lg max-w-md mx-auto">
          This brief interactive session allows our strategists to research your brand in real-time, ensuring we arrive at our call with a tailored 90-day roadmap and execution plan.
        </p>
      </div>

      <div className="pt-4 flex flex-col items-center space-y-4">
        <button onClick={onNext} className="btn-primary w-full sm:w-auto text-lg px-12">
          Let's Get Started
        </button>
        <p className="font-mono text-xs text-muted uppercase tracking-widest">
          All answers are multiple choice – no typing needed!
        </p>
      </div>
    </div>
  );
}
