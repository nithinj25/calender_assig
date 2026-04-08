"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import CalendarHeader from "@/components/Calendar/CalendarHeader";
import CalendarGrid from "@/components/Calendar/CalendarGrid";
import DayModal from "@/components/DayModal/DayModal";
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

  // For animation direction
  const [direction, setDirection] = useState(1);

  useEffect(() => setIsMounted(true), []);

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

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir < 0 ? 45 : -45,
    })
  };

  return (
    <main className="min-h-screen py-8 md:py-16 px-4 md:px-8 font-sans flex items-center justify-center relative bg-background-start">
      
      {/* Container simulating a physical desk or wall */}
      <div className="w-full max-w-[1000px] perspective-[2000px]">
        {/* The Wall Calendar Object */}
        <div className="calendar-paper w-full rounded-sm overflow-hidden flex flex-col mx-auto relative bg-surface z-10 origin-top">
          
          {/* Spiral Binder Element */}
          <div className="spiral-binder w-full absolute top-0 left-0" />

          {/* Page Flip Container */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentMonth.toISOString()}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                rotateY: { duration: 0.4 }
              }}
              className="flex flex-col origin-top pt-6"
            >
              
              {/* TOP HALF: Hero Image & Geometric Overlay */}
              <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden bg-gray-200">
                <img 
                  src="/hero.png" 
                  alt="Month Hero" 
                  className="absolute inset-0 w-full h-full object-cover object-center" 
                />
                
                {/* SVG Geometric Overlay matching the blue polygon design */}
                <svg
                  className="absolute bottom-0 left-0 w-full h-1/2"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polygon points="0,100 100,100 100,20 60,60 0,20" fill="var(--color-accent)" opacity="0.95" />
                  <polygon points="0,100 40,40 0,60" fill="var(--color-accentHover)" opacity="0.8" />
                </svg>

                {/* Overlaid Title Text */}
                <div className="absolute bottom-8 lg:bottom-12 right-8 lg:right-16 text-right">
                  <p className="text-white/90 text-2xl md:text-3xl font-light tracking-[0.2em] mb-1">
                    {format(currentMonth, "yyyy")}
                  </p>
                  <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tight text-white uppercase drop-shadow-lg">
                    {format(currentMonth, "MMMM")}
                  </h1>
                </div>
              </div>

              {/* BOTTOM HALF: Notebook lines & Grid */}
              <div className="bg-white flex flex-col md:flex-row min-h-[400px]">
                
                {/* Left Side: Notes Section resembling lined paper */}
                <div className="w-full md:w-1/3 p-6 md:p-8 border-r border-gray-100 flex flex-col space-y-8 relative">
                  
                  {/* General Notes */}
                  <div className="flex-1 flex flex-col">
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
                  </div>

                  {/* Range Notes */}
                  <div className={`flex-1 flex flex-col transition-opacity duration-300 ${!currentRangeKey ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
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
                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col relative z-20">
                  <CalendarHeader
                    currentMonth={currentMonth}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
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
    </main>
  );
}
