/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MultiSelect from "../components/MultiSelect";
import { FormState } from "../types";
import { Loader2 } from "lucide-react";

interface Step6ChallengesProps {
  state: FormState;
  onToggle: (challenge: string) => void;
  onOtherChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
}

const fallbackChallenges = [
  "Not getting enough leads",
  "Low social media engagement",
  "No clear marketing strategy",
  "Limited budget for marketing",
  "Don't know what's working",
  "Team bandwidth is stretched thin",
  "Poor website performance",
  "Inconsistent branding"
];

export default function Step6Challenges({ state, onToggle, onOtherChange, onBack, onNext, isLoading }: Step6ChallengesProps) {
  const options = state.aiAdaptiveQuestions.challenges.length > 0
    ? state.aiAdaptiveQuestions.challenges
    : fallbackChallenges;

  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-navy/5 rounded-full text-[10px] font-bold text-navy/60 uppercase tracking-widest">
          Market Resistance
        </div>
        <h2 className="text-3xl font-serif">What's holding you back?</h2>
        <p className="text-muted text-sm px-4">
          Identifying these pain points allows our strategy team to prioritize rapid-win solutions in your 90-day plan.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-gold" size={32} />
          <p className="text-muted font-medium animate-pulse">Personalizing questions for you...</p>
        </div>
      ) : (
        <MultiSelect
          options={options}
          selected={state.challenges}
          onToggle={onToggle}
          otherValue={state.otherChallenge}
          onOtherChange={onOtherChange}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className="btn-outline flex-1">Back</button>
        <button 
          onClick={onNext} 
          disabled={isLoading || state.challenges.length === 0}
          className="btn-primary flex-2"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
