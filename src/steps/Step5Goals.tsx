/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MultiSelect from "../components/MultiSelect";
import { FormState } from "../types";

interface Step5GoalsProps {
  state: FormState;
  onToggle: (goal: string) => void;
  onOtherChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const goalOptions = [
  "Increase Brand Awareness",
  "Generate More Leads",
  "Boost Online Sales / Revenue",
  "Improve Social Media Presence",
  "Launch a New Product or Service",
  "Enter a New Market / Geography",
  "Build Customer Loyalty & Retention",
  "Improve Online Reputation",
  "Automate Marketing Operations",
  "Get More Foot Traffic"
];

export default function Step5Goals({ state, onToggle, onOtherChange, onBack, onNext }: Step5GoalsProps) {
  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-navy/5 rounded-full text-[10px] font-bold text-navy/60 uppercase tracking-widest">
          Strategic Objectives
        </div>
        <h2 className="text-3xl font-serif">What are your top 90-day goals?</h2>
        <p className="text-muted text-sm px-4">
          Defining clear KPIs allows our AI to benchmark your potential against current industry leaders.
        </p>
      </div>

      <MultiSelect
        options={goalOptions}
        selected={state.goals}
        onToggle={onToggle}
        maxSelections={3}
        otherValue={state.otherGoal}
        onOtherChange={onOtherChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className="btn-outline flex-1">Back</button>
        <button 
          onClick={onNext} 
          disabled={state.goals.length === 0}
          className="btn-primary flex-2"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
