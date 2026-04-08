// Purpose: Renders the month/year layout and navigation arrows with modern UI.

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatMonthYear } from "@/utils/dateHelpers";
import { motion } from "framer-motion";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenPalette: () => void;
}

export default function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onOpenPalette,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 px-2">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] text-textMuted font-semibold">Month View</span>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          key={currentMonth.toISOString()} // Re-animate on month change
          className="text-2xl md:text-3xl font-sans font-semibold text-textPrimary tracking-wide"
        >
          {formatMonthYear(currentMonth)}
        </motion.h2>
      </div>
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPalette}
          className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2.5 transition-colors hover:bg-white text-textPrimary border border-white/80 backdrop-blur-md shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55)]"
          aria-label="Open command palette"
        >
          <Search className="w-4 h-4 text-textSecondary" />
          <span className="hidden md:inline text-[11px] uppercase tracking-wider text-textSecondary">Ctrl K</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevMonth}
          className="p-2.5 rounded-xl bg-white/80 hover:bg-white transition-colors text-textPrimary border border-white/80 backdrop-blur-md shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55)]"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-5 h-5 text-textSecondary hover:text-accent transition-colors" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNextMonth}
          className="p-2.5 rounded-xl bg-white/80 hover:bg-white transition-colors text-textPrimary border border-white/80 backdrop-blur-md shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55)]"
          aria-label="Next Month"
        >
          <ChevronRight className="w-5 h-5 text-textSecondary hover:text-accent transition-colors" />
        </motion.button>
      </div>
    </div>
  );
}
