/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ContactForm from "../components/ContactForm";
import { FormState } from "../types";
import { useState } from "react";

interface Step2ContactProps {
  state: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Contact({ state, onChange, onNext, onBack }: Step2ContactProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.name.trim()) newErrors.name = "Name is required";
    if (!state.email.trim() || !/\S+@\S+\.\S+/.test(state.email)) newErrors.email = "Valid email is required";
    if (!state.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    if (!state.website && !state.businessDescription.trim()) newErrors.businessDescription = "Please provide a website or description";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl">Tell us about your brand</h2>
        <p className="text-muted">We'll use this to research your business for the 90-day strategy.</p>
      </div>

      <ContactForm state={state} onChange={onChange} errors={errors} />

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button onClick={onBack} className="btn-outline flex-1">Back</button>
        <button onClick={handleNext} className="btn-primary flex-2">Next Step</button>
      </div>
    </div>
  );
}
