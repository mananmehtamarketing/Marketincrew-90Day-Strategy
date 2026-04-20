/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useReducer, useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { INITIAL_STATE, FormState, FormAction } from "./types";
import { generateAdaptiveOptions, scoreLead, researchBusiness } from "./services/geminiService";
import { INDUSTRIES } from "./constants";

// Steps
import ProgressBar from "./components/ProgressBar";
import StepWrapper from "./components/StepWrapper";
import Step1Welcome from "./steps/Step1Welcome";
import Step2Contact from "./steps/Step2Contact";
import Step3Industry from "./steps/Step3Industry";
import Step4Services from "./steps/Step4Services";
import Step5Goals from "./steps/Step5Goals";
import Step6Challenges from "./steps/Step6Challenges";
import StepAILoading from "./steps/StepAILoading";
import Step7Budget from "./steps/Step7Budget";
import Step10Summary from "./steps/Step10Summary";
import StepThankYou from "./steps/StepThankYou";

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };
    case 'SET_AI_QUESTIONS':
      return {
        ...state,
        aiAdaptiveQuestions: {
          ...state.aiAdaptiveQuestions,
          [action.category]: action.questions,
        },
      };
    case 'SET_QUALIFICATION':
      return { ...state, qualificationResult: action.result };
    case 'SET_RESEARCH':
      return { 
        ...state, 
        businessResearch: action.info, 
        detectedIndustry: action.detectedIndustry,
        country: action.detectedCountry || state.country,
        currencySymbol: action.currency || state.currencySymbol
      };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

const COUNTRY_MAP: Record<string, { country: string, currency: string }> = {
  '91': { country: 'India', currency: '₹' },
  '1': { country: 'USA/Canada', currency: '$' },
  '44': { country: 'UK', currency: '£' },
  '971': { country: 'UAE', currency: 'AED ' },
  '61': { country: 'Australia', currency: 'A$' },
  '65': { country: 'Singapore', currency: 'S$' },
};

export default function App() {
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    // Detect country from WhatsApp if user types +prefix
    if (state.whatsapp.startsWith('+')) {
      const prefix = Object.keys(COUNTRY_MAP).find(p => state.whatsapp.startsWith(`+${p}`));
      if (prefix && (!state.country || state.country !== COUNTRY_MAP[prefix].country)) {
        dispatch({ type: 'SET_FIELD', field: 'country', value: COUNTRY_MAP[prefix].country });
        dispatch({ type: 'SET_FIELD', field: 'currencySymbol', value: COUNTRY_MAP[prefix].currency });
      }
    }
  }, [state.whatsapp]);

  // Transitions
  const nextStep = useCallback(() => {
    setDirection("next");
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    setDirection("prev");
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const setField = (field: keyof FormState, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  // AI Triggers
  const fetchBusinessResearch = async () => {
    if (state.businessResearch) return;
    setIsAILoading(true);
    const research = await researchBusiness(state.name, state.website);
    
    // Try to match detected industry to our list
    const matchedIndustry = INDUSTRIES.find(ind => 
      research.industry.toLowerCase().includes(ind.id.toLowerCase()) || 
      research.industry.toLowerCase().includes(ind.label.toLowerCase().split(' ')[0].toLowerCase())
    );

    dispatch({ 
      type: 'SET_RESEARCH', 
      info: research.summary, 
      detectedIndustry: research.industry,
      detectedCountry: research.country,
      currency: research.currency
    });

    if (matchedIndustry) {
      dispatch({ type: 'SET_FIELD', field: 'industry', value: matchedIndustry.id });
      fetchIndustryChallenges(matchedIndustry.id);
    } else {
      // Set to other if no clear match
      dispatch({ type: 'SET_FIELD', field: 'industry', value: 'other' });
      dispatch({ type: 'SET_FIELD', field: 'otherIndustry', value: research.industry });
      fetchIndustryChallenges(research.industry);
    }
    
    setIsAILoading(false);
  };

  const fetchIndustryChallenges = async (industry: string) => {
    setIsAILoading(true);
    const questions = await generateAdaptiveOptions("challenges", industry, state.businessResearch);
    dispatch({ type: 'SET_AI_QUESTIONS', category: 'challenges', questions });
    setIsAILoading(false);
  };

  // Step logic overrides
  const handleIndustrySelect = (industryId: string) => {
    setField("industry", industryId);
    if (industryId !== 'other') {
      fetchIndustryChallenges(industryId);
    }
  };

  const handleServicesToggle = (service: string) => {
    const newServices = state.services.includes(service)
      ? state.services.filter(s => s !== service)
      : [...state.services, service];
    setField("services", newServices);
  };

  const handleGoalsToggle = (goal: string) => {
    const newGoals = state.goals.includes(goal)
      ? state.goals.filter(g => g !== goal)
      : [...state.goals, goal].slice(0, 3);
    setField("goals", newGoals);
  };

  const handleSubmit = async () => {
    // Score lead
    const result = await scoreLead(state);
    if (result) dispatch({ type: 'SET_QUALIFICATION', result });

    // Notify backend
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: state, qualificationResult: result }),
      });
      
      // Optional Google Sheets Logging via Webhook
      const webhookUrl = (import.meta as any).env.VITE_SHEETS_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // Common for Apps Script/Zapier
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            ...state,
            leadScore: result?.score,
            qualification: result?.reasoning
          }),
        });
      }
    } catch (e) {
      console.error("Notification failed", e);
    }
  };

  // Auto-submit on Summary Step
  useEffect(() => {
    if (state.currentStep === 9) {
      handleSubmit();
    }
  }, [state.currentStep]);

  return (
    <div className="min-h-screen pb-12 pt-4 flex flex-col items-center">
      <ProgressBar current={state.currentStep} total={10} />

      <header className="mb-0 z-10 w-full flex justify-center">
        <div className="flex flex-col items-center">
          <img 
            src="https://static.wixstatic.com/media/f2b119_11f9f03b17a749ec9bbc8720cca7225c~mv2.png/v1/fill/w_349,h_96,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/f2b119_11f9f03b17a749ec9bbc8720cca7225c~mv2.png" 
            alt="MarketinCrew" 
            className="h-16 md:h-20 w-auto object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'flex flex-col items-end leading-[0.8]';
              fallback.innerHTML = `
                <div class="font-serif text-4xl font-bold tracking-tighter">
                  <span class="text-navy">MAR</span><span class="text-gold">K</span><span class="text-navy">ETIN</span>
                </div>
                <div class="font-serif text-xl font-bold tracking-widest text-gold pr-1">
                  CREW
                </div>
              `;
              e.currentTarget.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      </header>

      <main className="w-full max-w-2xl relative">
        <AnimatePresence mode="wait" custom={direction}>
          {state.currentStep === 1 && (
            <StepWrapper key="step1" direction={direction}>
              <Step1Welcome onNext={nextStep} />
            </StepWrapper>
          )}
          {state.currentStep === 2 && (
            <StepWrapper key="step2" direction={direction}>
              <Step2Contact 
                state={state} 
                onChange={setField} 
                onNext={() => {
                  fetchBusinessResearch();
                  nextStep();
                }} 
                onBack={prevStep} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 3 && (
            <StepWrapper key="step3" direction={direction}>
              <Step3Industry 
                state={state} 
                onSelect={handleIndustrySelect} 
                onOtherChange={(val) => setField("otherIndustry", val)}
                onBack={prevStep} 
                onNext={nextStep} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 4 && (
            <StepWrapper key="step4" direction={direction}>
              <Step4Services 
                state={state} 
                onToggle={handleServicesToggle} 
                onOtherChange={(val) => setField("otherService", val)}
                onBack={prevStep} 
                onNext={nextStep} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 5 && (
            <StepWrapper key="step5" direction={direction}>
              <Step5Goals 
                state={state} 
                onToggle={handleGoalsToggle} 
                onOtherChange={(val) => setField("otherGoal", val)}
                onBack={prevStep} 
                onNext={nextStep} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 6 && (
            <StepWrapper key="step6" direction={direction}>
              <Step6Challenges 
                state={state} 
                onToggle={(c) => {
                  const newC = state.challenges.includes(c) ? state.challenges.filter(x => x !== c) : [...state.challenges, c];
                  setField("challenges", newC);
                }} 
                onOtherChange={(val) => setField("otherChallenge", val)}
                onBack={prevStep} 
                onNext={nextStep} 
                isLoading={isAILoading && state.aiAdaptiveQuestions.challenges.length === 0}
              />
            </StepWrapper>
          )}
          {state.currentStep === 7 && (
            <StepWrapper key="wait-step" direction={direction}>
              <StepAILoading 
                researchSummary={state.businessResearch} 
                onComplete={nextStep} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 8 && (
            <StepWrapper key="step7" direction={direction}>
              <Step7Budget 
                state={state} 
                onSelect={(b) => setField("budget", b)} 
                onBack={prevStep} 
                onNext={nextStep} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 9 && (
            <StepWrapper key="step10" direction={direction}>
              <Step10Summary 
                state={state} 
                onBookCall={() => {
                  setField("bookingStatus", "clicked");
                  window.open("https://calendar.app.google/R3My8nBeQeUWDQZXA", "_blank");
                  nextStep();
                }} 
              />
            </StepWrapper>
          )}
          {state.currentStep === 10 && (
            <StepWrapper key="thankyou" direction={direction}>
              <StepThankYou name={state.name} />
            </StepWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
