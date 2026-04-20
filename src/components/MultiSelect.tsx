/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  maxSelections?: number;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export default function MultiSelect({ 
  options, 
  selected, 
  onToggle, 
  maxSelections,
  otherValue,
  onOtherChange 
}: MultiSelectProps) {
  const isOtherSelected = selected.includes('Other');

  return (
    <div className="w-full space-y-4">
      <div className="w-full flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && maxSelections !== undefined && selected.length >= maxSelections;

          return (
            <motion.div
              key={option}
              layout
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => !isDisabled && onToggle(option)}
              className={`chip ${isSelected ? 'chip-selected' : isDisabled ? 'opacity-30 cursor-not-allowed' : 'bg-white hover:border-gold'}`}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {option}
            </motion.div>
          );
        })}
        <motion.div
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle('Other')}
          className={`chip ${isOtherSelected ? 'chip-selected' : 'bg-white hover:border-gold'}`}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          Other
        </motion.div>
      </div>

      <AnimatePresence>
        {isOtherSelected && onOtherChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <textarea
              value={otherValue || ''}
              onChange={(e) => onOtherChange(e.target.value)}
              placeholder="Tell us more about your specific needs..."
              rows={2}
              className="input-field mt-2 resize-none"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
