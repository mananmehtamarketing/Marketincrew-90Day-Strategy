/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SingleSelect from "../components/SingleSelect";
import { FormState } from "../types";

interface Step7BudgetProps {
  state: FormState;
  onSelect: (budget: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step7Budget({ state, onSelect, onBack, onNext }: Step7BudgetProps) {
  const currency = state.currencySymbol;
  
  const budgetOptions = [
    { id: "range1", label: `${currency}10,000 – ${currency}15,000 / month`, icon: "🌱" },
    { id: "range2", label: `${currency}15,000 – ${currency}30,000 / month`, icon: "🌿" },
    { id: "range3", label: `${currency}30,000 – ${currency}50,000 / month`, icon: "🚀" },
    { id: "range4", label: `${currency}50,000 – ${currency}1,00,000 / month`, icon: "⚡" },
    { id: "range5", label: `${currency}1,00,000 – ${currency}2,00,000 / month`, icon: "🔥" },
    { id: "range6", label: `${currency}2,00,000 – ${currency}5,00,000 / month`, icon: "💎" },
    { id: "range7", label: `${currency}5,00,000+ / month`, icon: "👑" },
  ];

  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-navy/5 rounded-full text-[10px] font-bold text-navy/60 uppercase tracking-widest">
          Resource Allocation
        </div>
        <h2 className="text-3xl font-serif text- navy">What monthly budget can you allocate?</h2>
        <p className="text-muted text-sm px-4">
          This helps us design a 90-day strategy that hits your goals within your means. We'll present a tiered plan based on this selection during our call.
        </p>
      </div>

      <SingleSelect
        options={budgetOptions}
        selectedId={state.budget}
        onSelect={onSelect}
      />

      <div className="glass-card p-4 bg-navy/5 border-navy/10">
        <p className="text-xs text-center text-muted leading-relaxed font-medium">
          Strategic investment is the engine of growth. Your selection helps us hand-pick the right channels and tools for your specific roadmap.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className="btn-outline flex-1">Back</button>
        <button 
          onClick={onNext} 
          disabled={!state.budget}
          className="btn-primary flex-2"
        >
          Finalize Strategy Details
        </button>
      </div>
    </div>
  );
}
