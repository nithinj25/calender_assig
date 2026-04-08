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

const moodToEmoji = {
  great: "🟢",
  good: "🔵",
  okay: "⚪",
  bad: "🔴",
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
  const moodEmoji = dayData?.mood ? moodToEmoji[dayData.mood] : null;

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
        isCurrentMonthFlag ? "bg-surface hover:bg-surface-hover backdrop-blur-md border-white/5" : "bg-transparent opacity-40 border-transparent",
        isDateToday && "border-todayRing shadow-[0_0_15px_rgba(56,189,248,0.3)] bg-todayRing/10",
        inRange && !isStart && !isEnd && "bg-rangeHighlight border-accent/20",
        (isStart || isEnd) && "bg-accent/20 border-accent shadow-[0_0_20px_rgba(96,165,250,0.4)]"
      )}
    >
      <div className="flex justify-between w-full items-start">
        <span
          className={cn(
            "text-sm md:text-base font-semibold",
            isDateToday ? "text-todayRing" : "text-white/90",
            (isStart || isEnd) && "text-accent font-bold"
          )}
        >
          {format(date, "d")}
        </span>
        <div className="flex items-center gap-1.5">
          {moodEmoji && <span className="text-[10px] text-shadow-sm drop-shadow-md">{moodEmoji}</span>}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDayClick(date);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/10 hover:bg-accent/80 rounded-lg text-white backdrop-blur-sm transition-all focus:opacity-100 shadow-md"
            aria-label="Open day notes"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full pointer-events-none" />

      {hasTodos && (
        <div className="flex gap-1 mt-auto">
          {dayData.todos.slice(0, 3).map((todo, i) => (
             <div key={i} className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]", todo.completed ? "bg-success text-success" : "bg-accent text-accent")} />
          ))}
          {dayData.todos.length > 3 && (
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          )}
        </div>
      )}
    </motion.div>
  );
}
