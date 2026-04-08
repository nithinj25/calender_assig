import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TodoList from "./TodoList";
import { DayData, MoodType } from "@/types";
import { formatLongDate, isToday as isDateToday } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";

interface DayModalProps {
  isOpen: boolean;
  date: Date | null;
  dayData: DayData;
  onClose: () => void;
  onUpdateDayData: (data: DayData) => void;
}

const MOODS: { type: MoodType; label: string; colorClass: string }[] = [
  { type: "great", label: "Great", colorClass: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { type: "good", label: "Good", colorClass: "bg-blue-100 text-blue-700 border-blue-200" },
  { type: "okay", label: "Okay", colorClass: "bg-slate-100 text-slate-700 border-slate-200" },
  { type: "bad", label: "Bad", colorClass: "bg-rose-100 text-rose-700 border-rose-200" },
];

export default function DayModal({
  isOpen,
  date,
  dayData,
  onClose,
  onUpdateDayData,
}: DayModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !date) return null;

  const isToday = isDateToday(date);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md glass-panel-heavy border-l border-white/10 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6 pb-24">
              <div className="flex items-center justify-between mb-8">
                <h2 id="modal-title" className="text-xl font-sans font-medium text-white tracking-wider">
                  {formatLongDate(date)}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-textSecondary hover:text-white hover:bg-white/10 rounded-xl transition-colors backdrop-blur-md"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isToday && (
                <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-xl mb-8 leading-relaxed text-sm shadow-[0_0_15px_rgba(96,165,250,0.1)]">
                  <div className="flex gap-3">
                    <span className="text-sm font-bold" aria-hidden="true">*</span>
                    <div>
                      <p className="font-semibold mb-1 uppercase tracking-widest text-[10px]">On this day last year</p>
                      <p className="italic opacity-90 text-white/80 font-serif">
                        Started learning React. Feeling overwhelmed but excited.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-widest mb-3">
                  Status Indicator
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(({ type, label, colorClass }) => (
                    <button
                      key={type}
                      onClick={() =>
                        onUpdateDayData({
                          ...dayData,
                          mood: dayData.mood === type ? null : type,
                        })
                      }
                      className={cn(
                        "px-3 py-2 text-xs font-semibold rounded-lg transition-all border outline-none",
                        dayData.mood === type
                          ? cn(colorClass, "shadow-[0_0_15px_rgba(96,165,250,0.3)] scale-105")
                          : "bg-surface-hover border-white/5 hover:bg-white/10 hover:scale-105 text-textSecondary"
                      )}
                      aria-label={`Set status to ${type}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-widest mb-3">
                  Daily Log
                </h3>
                <textarea
                  value={dayData.notes}
                  onChange={(e) =>
                    onUpdateDayData({ ...dayData, notes: e.target.value })
                  }
                  placeholder="Record what happened today..."
                  className="w-full bg-surface/50 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-textSecondary/50 min-h-[140px] focus:outline-none focus:border-accent/50 transition-all resize-none shadow-sm font-sans"
                />
              </div>

              <TodoList
                todos={dayData.todos}
                onTodosChange={(newTodos) =>
                  onUpdateDayData({ ...dayData, todos: newTodos })
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
