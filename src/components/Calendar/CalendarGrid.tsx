import { AnimatePresence, motion } from "framer-motion";
import DayCell from "./DayCell";
import {
  getDaysInMonth,
  getLeadingEmptyDays,
  isCurrentMonth as isDateCurrentMonth,
  formatDateKey,
} from "@/utils/dateHelpers";
import { CalendarState, DateRange } from "@/types";

interface CalendarGridProps {
  currentMonth: Date;
  calendarState: CalendarState;
  dateRange: DateRange;
  onDayClick: (date: Date) => void;
  onRangeSelect: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export default function CalendarGrid({
  currentMonth,
  calendarState,
  dateRange,
  onDayClick,
  onRangeSelect,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(currentMonth);
  const leadingDaysCount = getLeadingEmptyDays(currentMonth);
  const leadingArray = Array.from({ length: leadingDaysCount });

  return (
    <div className="w-full relative min-h-[400px]">
      <div className="grid grid-cols-7 mb-4">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold tracking-widest text-textSecondary uppercase ${
              idx === 0 || idx === 6 ? "text-accent/70" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.toString()}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-7 gap-1 md:gap-2"
        >
          {/* Leading empty cells */}
          {leadingArray.map((_, i) => (
            <motion.div 
              key={`empty-${i}`} 
              className="p-2 min-h-[90px] md:min-h-[110px] rounded-xl bg-surface/20 border border-white/5" 
            />
          ))}

          {/* Actual days */}
          {daysInMonth.map((date) => {
            const dateKey = formatDateKey(date);
            const data = calendarState[dateKey];
            const isCurrentMonthFlag = isDateCurrentMonth(date, currentMonth);

            return (
              <DayCell
                key={date.toString()}
                date={date}
                dayData={data}
                range={dateRange}
                isCurrentMonthFlag={isCurrentMonthFlag}
                onDayClick={onDayClick}
                onRangeSelect={onRangeSelect}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
