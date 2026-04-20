/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormState } from "../types";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Step10SummaryProps {
  state: FormState;
  onBookCall: () => void;
}

export default function Step10Summary({ state, onBookCall }: Step10SummaryProps) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#0B1F3A', '#FDB813'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#0B1F3A', '#FDB813'] });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-8 py-4">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block bg-success/10 p-3 rounded-full mb-2"
        >
          <CheckCircle2 size={48} className="text-success" />
        </motion.div>
        <h2 className="text-4xl">Information Received!</h2>
        <p className="text-muted">Our expert team is now reviewing your answers to begin drafting your personalized 90-day execution plan.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-xl border-b border-slate-100 pb-2 mb-4">Strategic Submission Summary</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-muted font-medium mb-1 uppercase text-[10px] tracking-wider">Business</p>
            <p className="font-semibold">{state.name}</p>
          </div>
          <div>
            <p className="text-muted font-medium mb-1 uppercase text-[10px] tracking-wider">Industry</p>
            <p className="font-semibold capitalize">{state.industry === 'other' ? state.otherIndustry : state.industry}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted font-medium mb-1 uppercase text-[10px] tracking-wider">Growth Focus</p>
            <p className="font-semibold line-clamp-1">{state.services.join(", ")}</p>
          </div>
          <div>
            <p className="text-muted font-medium mb-1 uppercase text-[10px] tracking-wider">Monthly Budget</p>
            <p className="font-semibold capitalize text-navy font-bold">{state.budget}</p>
          </div>
          <div>
            <p className="text-muted font-medium mb-1 uppercase text-[10px] tracking-wider">Next Step</p>
            <p className="font-semibold capitalize text-success">Book Call</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onBookCall}
          className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
        >
          <Calendar size={20} />
          <span>Book Your 90-Day Strategy Call</span>
        </button>
        <p className="text-center text-sm text-muted">
          During this call, our strategists will present the finalized 90-day roadmap built specifically for your brand.
        </p>
      </div>

      <p className="text-center text-xs text-muted font-medium">
        Booking a call is mandatory to receive the full strategy document.
      </p>
    </div>
  );
}
