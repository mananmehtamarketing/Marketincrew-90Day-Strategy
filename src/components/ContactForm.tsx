/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormState } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ContactFormProps {
  state: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  errors: Record<string, string>;
}

export default function ContactForm({ state, onChange, errors }: ContactFormProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-navy">Full Name *</label>
        <input
          type="text"
          value={state.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g. Robin Sharma"
          className={`input-field ${errors.name ? 'border-red-500 ring-red-100' : ''}`}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 font-medium"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-navy">Email Address *</label>
        <input
          type="email"
          value={state.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="robin@company.com"
          className={`input-field ${errors.email ? 'border-red-500 ring-red-100' : ''}`}
        />
        {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-navy">WhatsApp Number *</label>
        <input
          type="tel"
          value={state.whatsapp}
          onChange={(e) => onChange("whatsapp", e.target.value)}
          placeholder="e.g. +91 98765 43210"
          className={`input-field ${errors.whatsapp ? 'border-red-500 ring-red-100' : ''}`}
        />
        {errors.whatsapp && <p className="text-xs text-red-500 font-medium">{errors.whatsapp}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-navy">Your Website URL (Optional)</label>
        <input
          type="text"
          value={state.website}
          onChange={(e) => onChange("website", e.target.value)}
          placeholder="https://marketincrew.com"
          className="input-field"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-navy">Briefly describe your business *</label>
        <p className="text-[10px] text-muted-foreground italic mb-1">
          Ideal: "A premium fitness brand for immigrant founders, offering personalized coaching and community platform. We help foreign-born entrepreneurs scale their health startups in the US market."
        </p>
        <textarea
          value={state.businessDescription}
          onChange={(e) => onChange("businessDescription", e.target.value)}
          placeholder="Tell us what you do, who you serve, and your core mission..."
          rows={3}
          className={`input-field resize-none ${errors.businessDescription ? 'border-red-500 ring-red-100' : ''}`}
        />
        {errors.businessDescription && <p className="text-xs text-red-500 font-medium">{errors.businessDescription}</p>}
      </div>
    </div>
  );
}
