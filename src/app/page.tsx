"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import CalendarGrid from "@/components/Calendar/CalendarGrid";
import DayModal from "@/components/DayModal/DayModal";
import CommandPalette, { CommandAction } from "@/components/Layout/CommandPalette";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDateRange } from "@/hooks/useDateRange";
import { getNextMonth, getPrevMonth, formatDateKey } from "@/utils/dateHelpers";
import { CalendarState, DayData } from "@/types";

const INITIAL_DAY_DATA: DayData = {
  todos: [],
  notes: "",
  mood: null,
};

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarState, setCalendarState] = useLocalStorage<CalendarState>(
    "chronicle_calendar_state",
    {}
  );
  
  const [globalNotes, setGlobalNotes] = useLocalStorage<string>(
    "chronicle_global_notes",
    ""
  );
  
  const { range, handleDateSelect } = useDateRange();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // For animation direction
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(getPrevMonth(currentMonth));
  };
  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(getNextMonth(currentMonth));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const commandActions: CommandAction[] = [
    {
      id: "go-today",
      title: "Go to Today",
      description: "Jump the calendar to the current month",
      keywords: ["today", "current month", "jump"],
      run: () => {
        const today = new Date();
        setCurrentMonth(today);
      },
    },
    {
      id: "open-today",
      title: "Open Today Details",
      description: "Open the day modal for today",
      keywords: ["details", "today", "modal"],
      run: () => {
        const today = new Date();
        setCurrentMonth(today);
        setSelectedDate(today);
        setIsModalOpen(true);
      },
    },
    {
      id: "next-month",
      title: "Go to Next Month",
      description: "Move calendar forward by one month",
      keywords: ["next", "month", "forward"],
      run: handleNextMonth,
    },
    {
      id: "prev-month",
      title: "Go to Previous Month",
      description: "Move calendar backward by one month",
      keywords: ["previous", "month", "back"],
      run: handlePrevMonth,
    },
    {
      id: "close-day-modal",
      title: "Close Day Panel",
      description: "Close the opened day modal",
      keywords: ["close", "panel", "modal"],
      run: () => setIsModalOpen(false),
    },
  ];
  
  if (!isMounted) return <main className="min-h-screen bg-transparent" />; 

  const activeDayData = selectedDate
    ? calendarState[formatDateKey(selectedDate)] || INITIAL_DAY_DATA
    : INITIAL_DAY_DATA;

  const handleUpdateDayData = (newData: DayData) => {
    if (!selectedDate) return;
    const dateKey = formatDateKey(selectedDate);
    setCalendarState((prev) => ({
      ...prev,
      [dateKey]: newData,
    }));
  };

  const getRangeKey = () => 
    range.start && range.end
      ? `range_${formatDateKey(range.start)}_${formatDateKey(range.end)}`
      : null;

  const currentRangeKey = getRangeKey();
  const rangeNotes = currentRangeKey && calendarState[currentRangeKey]?.notes 
    ? calendarState[currentRangeKey].notes 
    : "";

  const handleUpdateRangeNotes = (newNotes: string) => {
    if (!currentRangeKey) return;
    setCalendarState((prev) => ({
      ...prev,
      [currentRangeKey]: {
        ...INITIAL_DAY_DATA,
        ...(prev[currentRangeKey] || {}),
        notes: newNotes,
      },
    }));
  };

  const monthKey = format(currentMonth, "yyyy-MM");

  return (
    <main className="min-h-screen py-8 md:py-16 px-4 md:px-8 font-sans flex items-center justify-center relative bg-background-start bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.08)_0%,transparent_28%),radial-gradient(circle_at_85%_76%,rgba(99,102,241,0.06)_0%,transparent_30%)]">
      
      {/* Container simulating a physical desk or wall */}
      <div
        className="w-full max-w-[1000px]"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 0%", transformStyle: "preserve-3d" }}
      >
        {/* The Wall Calendar Object */}
        <div className="calendar-paper w-full rounded-sm overflow-hidden flex flex-col mx-auto relative bg-surface z-10 origin-top">
          
          {/* Spiral Binder Element */}
          <div className="spiral-binder w-full absolute top-0 left-0" />

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={monthKey}
              initial={{ rotateX: direction * -90, opacity: 0.6 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: direction * 90, opacity: 0.6 }}
              transition={{ duration: 0.25, ease: [0.12, 0.8, 0.32, 1] }}
              style={{ transformStyle: "preserve-3d", transformOrigin: "top center", backfaceVisibility: "hidden" }}
              className="pt-6"
            >
              {/* TOP HALF: Hero Image & Geometric Overlay */}
              <div className="relative w-full h-[320px] md:h-[430px] overflow-hidden bg-slate-100">
                <Image
                  src="/hero-white.svg"
                  alt="Month Hero"
                  fill
                  priority
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-transparent"
                />

                <motion.div
                  aria-hidden
                  className="absolute -top-20 right-[8%] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.1)_65%,transparent_100%)]"
                  animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden
                  className="absolute -bottom-16 left-[12%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0.03)_60%,transparent_100%)]"
                  animate={{ y: [0, 8, 0], x: [0, -8, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Layered overlays to keep text readable on a bright hero image */}
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.45)_35%,rgba(255,255,255,0.12)_65%,rgba(15,23,42,0.16)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_68%,rgba(59,130,246,0.22)_0%,rgba(59,130,246,0)_50%)]" />
                <div className="absolute inset-0 opacity-[0.16] mix-blend-multiply bg-[linear-gradient(transparent_96%,rgba(100,116,139,0.32)_100%)] bg-[length:100%_7px]" />

                <svg
                  className="absolute bottom-0 left-0 w-full h-1/2"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polygon points="0,100 100,100 100,22 60,60 0,22" fill="rgba(59,130,246,0.84)" />
                  <polygon points="0,100 42,42 0,63" fill="rgba(37,99,235,0.68)" />
                </svg>

                {/* Overlaid Title Text */}
                <div className="absolute bottom-8 lg:bottom-12 right-8 lg:right-16 text-right">
                  <p className="text-slate-800 text-2xl md:text-3xl font-medium tracking-[0.2em] mb-1 drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)]">
                    {format(currentMonth, "yyyy")}
                  </p>
                  <h1 className="font-sans text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 uppercase drop-shadow-[0_3px_14px_rgba(255,255,255,0.75)]">
                    {format(currentMonth, "MMMM")}
                  </h1>
                </div>
              </div>

            {/* BOTTOM HALF: Notebook lines & Grid */}
            <div className="bg-white flex flex-col md:flex-row min-h-[400px]">
              
              {/* Left Side: Notes Section resembling lined paper */}
              <div className="w-full md:w-1/3 p-6 md:p-8 border-r border-slate-200/80 flex flex-col space-y-6 relative bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)]">
                
                {/* General Notes */}
                <div className="flex-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)]">
                  <h3 className="font-sans text-[10px] font-bold text-textPrimary uppercase tracking-widest mb-3 pb-2 border-b-2 border-accent inline-block self-start">
                    Notes
                  </h3>
                  <div 
                    className="flex-1 relative min-h-[140px]"
                    style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 32px)', backgroundAttachment: 'local' }}
                  >
                    <textarea
                      className="w-full h-full bg-transparent p-0 text-textSecondary text-sm leading-[32px] focus:outline-none resize-none font-sans"
                      placeholder="General monthly memos..."
                      value={globalNotes}
                      onChange={(e) => setGlobalNotes(e.target.value)}
                      style={{ paddingTop: '4px' }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] font-medium tracking-wide text-textMuted">Auto-saves locally as you type</p>
                </div>

                {/* Range Notes */}
                <div className={`flex-1 flex flex-col rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] transition-opacity duration-300 ${!currentRangeKey ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <h3 className="font-sans text-[10px] font-bold text-accent uppercase tracking-widest mb-3 pb-2 border-b-2 border-accent/30 inline-block self-start">
                    {range.start && range.end 
                      ? `${format(range.start, "MMM d")} - ${format(range.end, "MMM d")}` 
                      : "Range Plan"}
                  </h3>
                  <div 
                    className="flex-1 relative min-h-[100px]"
                    style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(59,130,246,0.2) 32px)', backgroundAttachment: 'local' }}
                  >
                    <textarea
                      disabled={!currentRangeKey}
                      className="w-full h-full bg-transparent p-0 text-accent/80 text-sm leading-[32px] focus:outline-none resize-none font-sans"
                      placeholder={currentRangeKey ? "Specific notes for this period..." : "Select dates..."}
                      value={rangeNotes}
                      onChange={(e) => handleUpdateRangeNotes(e.target.value)}
                      style={{ paddingTop: '4px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: The actual calendar digits */}
              <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col relative z-20 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
                <CalendarHeader
                  currentMonth={currentMonth}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  onOpenPalette={() => setIsPaletteOpen(true)}
                />

                <div className="flex-1 mt-4">
                  <CalendarGrid
                    currentMonth={currentMonth}
                    calendarState={calendarState}
                    dateRange={range}
                    onDayClick={handleDayClick}
                    onRangeSelect={handleDateSelect}
                  />
                </div>
              </div>

            </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <DayModal
        isOpen={isModalOpen}
        date={selectedDate}
        dayData={activeDayData}
        onClose={() => setIsModalOpen(false)}
        onUpdateDayData={handleUpdateDayData}
      />

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        actions={commandActions}
      />
    </main>
  );
}
