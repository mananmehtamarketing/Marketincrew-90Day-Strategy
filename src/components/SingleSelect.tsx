/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

interface Option {
  id: string;
  label: string;
  icon?: string;
}

interface SingleSelectProps {
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
  grid?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export default function SingleSelect({ 
  options, 
  selectedId, 
  onSelect, 
  grid = true,
  otherValue,
  onOtherChange 
}: SingleSelectProps) {
  return (
    <div className="w-full space-y-4">
      <div className={`w-full ${grid ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}`}>
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.id)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-3 h-full ${
                isSelected
                  ? 'border-navy bg-navy text-white shadow-lg'
                  : 'border-slate-200 bg-white hover:border-gold'
              }`}
            >
              {option.icon && <span className="text-2xl">{option.icon}</span>}
              <span className="font-medium flex-1">{option.label}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gold rounded-full p-1"
                >
                  <Check size={16} className="text-navy" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedId === 'other' && onOtherChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              value={otherValue || ''}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Please specify... (be as detailed as you like)"
              className="input-field mt-2"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
