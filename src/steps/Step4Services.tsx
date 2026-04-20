/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MultiSelect from "../components/MultiSelect";
import { FormState } from "../types";

interface Step4ServicesProps {
  state: FormState;
  onToggle: (service: string) => void;
  onOtherChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const serviceOptions = [
  "Social Media Management",
  "Performance Marketing (Paid Ads)",
  "SEO & Content Marketing",
  "Website Design & Development",
  "Branding & Visual Identity",
  "Email & WhatsApp Marketing",
  "Video Production & Reels",
  "Influencer Marketing",
  "PR & Communications",
  "AI & Automation Solutions",
  "Full-Stack Digital Strategy"
];

export default function Step4Services({ state, onToggle, onOtherChange, onBack, onNext }: Step4ServicesProps) {
  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-navy/5 rounded-full text-[10px] font-bold text-navy/60 uppercase tracking-widest">
          Growth Channels
        </div>
        <h2 className="text-3xl font-serif">What services interest you?</h2>
        <p className="text-muted text-sm px-4">
          Selecting these helps us audit your current presence in these specific areas before our strategy session.
        </p>
      </div>

      <MultiSelect
        options={serviceOptions}
        selected={state.services}
        onToggle={onToggle}
        otherValue={state.otherService}
        onOtherChange={onOtherChange}
      />

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className="btn-outline flex-1">Back</button>
        <button 
          onClick={onNext} 
          disabled={state.services.length === 0}
          className="btn-primary flex-2"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
