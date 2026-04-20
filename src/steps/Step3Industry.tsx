/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SingleSelect from "../components/SingleSelect";
import { FormState } from "../types";
import { motion } from "motion/react";

import { INDUSTRIES } from "../constants";

interface Step3IndustryProps {
  state: FormState;
  onSelect: (industry: string) => void;
  onOtherChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Industry({ state, onSelect, onOtherChange, onBack, onNext }: Step3IndustryProps) {
  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-navy/5 rounded-full text-[10px] font-bold text-navy/60 uppercase tracking-widest">
          Industry Context
        </div>
        <h2 className="text-3xl font-serif">What industry are you in?</h2>
        <p className="text-muted text-sm px-4">
          This allows us to cross-reference your brand with specific market benchmarks and competitor data for your 90-day roadmap.
        </p>

        {state.detectedIndustry && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-navy/5 border border-navy/10 p-4 rounded-xl mb-4"
          >
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Brand Audit Progress</p>
            <p className="text-xl font-serif text-navy">We've identified your sector as: {state.detectedIndustry}</p>
            <p className="text-[10px] text-muted mt-2 font-medium">If this is incorrect, please select the best fit below.</p>
          </motion.div>
        )}
      </div>

      <SingleSelect
        options={INDUSTRIES}
        selectedId={state.industry}
        onSelect={onSelect}
        otherValue={state.otherIndustry}
        onOtherChange={onOtherChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className="btn-outline flex-1">Back</button>
        <button 
          onClick={onNext} 
          disabled={!state.industry && !state.detectedIndustry}
          className="btn-primary flex-2"
        >
          Confirm & Continue research
        </button>
      </div>
    </div>
  );
}
