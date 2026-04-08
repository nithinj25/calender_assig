import { format, isBefore, isAfter } from "date-fns";
import { motion } from "framer-motion";
import { DayData, DateRange } from "@/types";
import { isToday, isSame } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";

interface DayCellProps {
  date: Date;
  dayData?: DayData;
  range: DateRange;
  isCurrentMonthFlag: boolean;
  onDayClick: (date: Date) => void;
  onRangeSelect: (date: Date) => void;
}

const moodToLabel = {
  great: "Great",
  good: "Good",
  okay: "Okay",
  bad: "Bad",
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DayCell({
  date,
  dayData,
  range,
  isCurrentMonthFlag,
  onDayClick,
  onRangeSelect,
}: DayCellProps) {
  const isDateToday = isToday(date);
  
  const isStart = range.start ? isSame(date, range.start) : false;
  const isEnd = range.end ? isSame(date, range.end) : false;
  const inRange =
    range.start && range.end
      ? (isAfter(date, range.start) && isBefore(date, range.end)) || isStart || isEnd
      : false;

  const hasTodos = dayData?.todos && dayData.todos.length > 0;
  const moodLabel = dayData?.mood ? moodToLabel[dayData.mood] : null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onDayClick(date);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onRangeSelect(date)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDayClick(date);
      }}
      className={cn(
        "relative flex flex-col p-3 min-h-[90px] md:min-h-[110px] rounded-xl transition-all duration-300 outline-none group cursor-pointer overflow-hidden border",
        isCurrentMonthFlag ? "bg-surface hover:bg-surface-hover backdrop-blur-md border-slate-200/70" : "bg-slate-100/55 border-slate-200/40",
        isDateToday && "border-todayRing shadow-[0_0_15px_rgba(56,189,248,0.25)] bg-todayRing/10",
        inRange && !isStart && !isEnd && "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,rgba(59,130,246,0.08)_100%)] border-accent/20",
        (isStart || isEnd) && "bg-[linear-gradient(180deg,rgba(59,130,246,0.26)_0%,rgba(59,130,246,0.16)_100%)] border-accent shadow-[0_0_20px_rgba(96,165,250,0.3)]",
        "hover:border-accent/45 hover:shadow-[0_12px_26px_-20px_rgba(30,64,175,0.8)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_18%_14%,rgba(59,130,246,0.16)_0%,rgba(59,130,246,0)_58%)]" />
      <div className="pointer-events-none absolute inset-x-3 top-0 h-[1px] bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.6),transparent)] opacity-70" />
      <div className="flex justify-between w-full items-start">
        <span
          className={cn(
            "text-sm md:text-base font-semibold relative z-10",
            isCurrentMonthFlag ? "text-textPrimary" : "text-textSecondary",
            isDateToday && "text-todayRing",
            (isStart || isEnd) && "text-accent font-bold"
          )}
        >
          {format(date, "d")}
        </span>
        <div className="flex items-center gap-1.5 relative z-10">
          {moodLabel && <span className="text-[10px] font-medium text-textSecondary">{moodLabel}</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDayClick(date);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 bg-white hover:bg-accent/10 rounded-lg text-textSecondary hover:text-accent border border-slate-200/80 transition-all focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 shadow-sm"
            aria-label="Open day notes"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full pointer-events-none" />

      {hasTodos && (
        <div className="flex items-center gap-1 mt-auto relative z-10">
          {dayData.todos.slice(0, 3).map((todo, i) => (
             <div key={i} className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]", todo.completed ? "bg-success text-success" : "bg-accent text-accent")} />
          ))}
          {dayData.todos.length > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400/60" />
          )}
          <span className="ml-1 text-[10px] font-medium text-textMuted">{dayData.todos.length}</span>
        </div>
      )}
    </motion.div>
  );
}
