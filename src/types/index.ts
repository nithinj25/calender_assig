// Purpose: Shared TypeScript interfaces for the application.

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  details: string; // expanded accordion detail text
  createdAt: string;
}

export type MoodType = 'great' | 'good' | 'okay' | 'bad' | null;

export interface DayData {
  todos: TodoItem[];
  notes: string; // free-form note for the day
  mood: MoodType;
}

export interface CalendarState {
  [dateKey: string]: DayData; // dateKey format: "YYYY-MM-DD"
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}
