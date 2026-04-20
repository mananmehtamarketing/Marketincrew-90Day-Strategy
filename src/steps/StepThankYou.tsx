/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink, Instagram, Linkedin, Globe } from "lucide-react";
import { motion } from "motion/react";

interface StepThankYouProps {
  name: string;
}

export default function StepThankYou({ name }: StepThankYouProps) {
  return (
    <div className="text-center space-y-8 py-12">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl">Thank You, {name || 'there'}!</h2>
        <p className="text-muted text-lg max-w-md mx-auto">
          We've received your information and our team will reach out within 24 hours.
        </p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <p className="font-semibold text-lg">While you wait, check us out:</p>
        <div className="flex justify-center space-x-6">
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            href="https://instagram.com/marketincrew"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-navy text-white rounded-full hover:bg-gold hover:text-navy transition-colors"
          >
            <Instagram size={24} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            href="https://linkedin.com/company/marketincrew"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-navy text-white rounded-full hover:bg-gold hover:text-navy transition-colors"
          >
            <Linkedin size={24} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            href="https://marketincrew.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-navy text-white rounded-full hover:bg-gold hover:text-navy transition-colors"
          >
            <Globe size={24} />
          </motion.a>
        </div>
      </div>

      <div className="pt-4">
        <a 
          href="https://marketincrew.com" 
          className="text-navy font-medium flex items-center justify-center space-x-1 hover:underline underline-offset-4"
        >
          <span>Visit MarketinCrew Website</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
