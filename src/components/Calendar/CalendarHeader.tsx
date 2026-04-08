// Purpose: Renders the month/year layout and navigation arrows with modern UI.

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "@/utils/dateHelpers";
import { motion } from "framer-motion";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 px-2">
      <motion.h2 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        key={currentMonth.toISOString()} // Re-animate on month change
        className="text-2xl md:text-3xl font-sans font-medium text-white tracking-wide"
      >
        {formatMonthYear(currentMonth)}
      </motion.h2>
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevMonth}
          className="p-2.5 rounded-xl bg-surface-hover hover:bg-white/10 transition-colors text-white border border-white/10 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-5 h-5 text-textSecondary hover:text-white transition-colors" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNextMonth}
          className="p-2.5 rounded-xl bg-surface-hover hover:bg-white/10 transition-colors text-white border border-white/10 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
          aria-label="Next Month"
        >
          <ChevronRight className="w-5 h-5 text-textSecondary hover:text-white transition-colors" />
        </motion.button>
      </div>
    </div>
  );
}
