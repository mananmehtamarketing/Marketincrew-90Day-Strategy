/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Loader2, Search, Users } from "lucide-react";
import { useEffect } from "react";

interface StepAILoadingProps {
  onComplete: () => void;
  researchSummary: string;
}

export default function StepAILoading({ onComplete, researchSummary }: StepAILoadingProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 py-12 text-center">
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative"
      >
        <Users size={64} className="text-gold" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Loader2 size={24} className="text-navy opacity-50" />
        </motion.div>
      </motion.div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-bold font-serif text-navy">Preparing for Your Call...</h2>
        <p className="text-muted text-sm leading-relaxed">
          Our team is reviewing your profile and market data to begin drafting your 90-day execution roadmap. This allows us to hit the ground running during our session.
        </p>

        {researchSummary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="glass-card p-4 text-left border-l-4 border-gold bg-gold/5"
          >
            <div className="flex items-center space-x-2 mb-2 text-navy/60">
              <Search size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Research Underway</span>
            </div>
            <p className="text-xs text-navy/80 italic font-medium leading-relaxed font-sans">
              "We're auditing your current industry position: {researchSummary}"
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex space-x-2">
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-gold"
        />
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="w-2 h-2 rounded-full bg-gold"
        />
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          className="w-2 h-2 rounded-full bg-gold"
        />
      </div>
    </div>
  );
}
