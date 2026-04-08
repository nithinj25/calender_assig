import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2 } from "lucide-react";
import { TodoItem as TodoItemType } from "@/types";

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateDetails: (id: string, details: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateDetails,
}: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, y: 10 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, scale: 0.95 }}
      className="group bg-surface-hover/50 border border-white/5 rounded-xl overflow-hidden mb-2 shadow-sm focus-within:border-white/20 transition-colors"
    >
      <div className="flex items-center justify-between p-3">
        <label className="flex items-center gap-3 cursor-pointer flex-1">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="peer appearance-none w-5 h-5 rounded-md border border-white/20 bg-surface-hover checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all cursor-pointer"
            />
            <svg
              className={`absolute w-3 h-3 text-white pointer-events-none transition-opacity ${todo.completed ? 'opacity-100' : 'opacity-0'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            className={`text-sm tracking-wide transition-all ${
              todo.completed
                ? "line-through text-textSecondary opacity-50"
                : "text-white/90 font-medium"
            }`}
          >
            {todo.text}
          </span>
        </label>
        
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-textSecondary hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
            aria-label="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 transition-colors rounded-lg ${isExpanded ? 'text-white bg-white/10' : 'text-textSecondary hover:text-white hover:bg-white/10'}`}
            aria-label="Expand details"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3 pt-0"
          >
            <div className="pl-8">
              <textarea
                value={todo.details}
                onChange={(e) => onUpdateDetails(todo.id, e.target.value)}
                placeholder="Expand on this task..."
                className="w-full bg-black/20 border border-white/5 rounded-lg p-2.5 text-xs text-textSecondary focus:outline-none focus:border-accent/40 focus:text-white/80 transition-all min-h-[60px] resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
