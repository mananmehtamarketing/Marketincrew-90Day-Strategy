/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FormState {
  currentStep: number;
  name: string;
  email: string;
  whatsapp: string;
  website: string;
  businessDescription: string;
  industry: string;
  otherIndustry: string;
  country: string;
  currencySymbol: string;
  services: string[];
  otherService: string;
  goals: string[];
  otherGoal: string;
  challenges: string[];
  otherChallenge: string;
  budget: string;
  currentSetup: string[];
  otherSetup: string;
  businessResearch: string; // Grounded info from Gemini
  detectedIndustry: string;
  aiAdaptiveQuestions: {
    challenges: string[];
    currentSetup: string[];
  };
  qualificationResult?: {
    score: number;
    summary: string;
    priority: "HOT" | "WARM" | "COLD";
    recommendedServices: string[];
    talkingPoints: string[];
  };
  bookingStatus: 'pending' | 'clicked' | 'skipped';
}

export type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState; value: any }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' }
  | { type: 'SET_AI_QUESTIONS'; category: 'challenges' | 'currentSetup'; questions: string[] }
  | { type: 'SET_RESEARCH'; info: string; detectedIndustry: string; detectedCountry?: string; currency?: string }
  | { type: 'SET_QUALIFICATION'; result: FormState['qualificationResult'] };

export const INITIAL_STATE: FormState = {
  currentStep: 1,
  name: '',
  email: '',
  whatsapp: '',
  website: '',
  businessDescription: '',
  industry: '',
  otherIndustry: '',
  country: '',
  currencySymbol: '₹', // Default to INR
  services: [],
  otherService: '',
  goals: [],
  otherGoal: '',
  challenges: [],
  otherChallenge: '',
  budget: '',
  currentSetup: [],
  otherSetup: '',
  businessResearch: '',
  detectedIndustry: '',
  aiAdaptiveQuestions: {
    challenges: [],
    currentSetup: [],
  },
  bookingStatus: 'pending',
};
