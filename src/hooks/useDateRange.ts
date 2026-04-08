// Purpose: Hook to manage the range start/end selection state.

import { useState } from "react";
import { isBefore } from "date-fns";
import { DateRange } from "@/types";

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  const handleDateSelect = (date: Date) => {
    // If no start or if range is already full, start a new range
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
      return;
    }

    // If start is set but no end
    if (range.start && !range.end) {
      if (isBefore(date, range.start)) {
        // Swap if end is before start
        setRange({ start: date, end: range.start });
      } else {
        setRange({ start: range.start, end: date });
      }
    }
  };

  return { range, handleDateSelect };
}
