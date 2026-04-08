import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

export interface CommandAction {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  run: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export default function CommandPalette({ isOpen, onClose, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClose = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  const filteredActions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return actions;

    return actions.filter((action) => {
      const haystack = [action.title, action.description, ...(action.keywords || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [actions, query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredActions.length === 0 ? 0 : (prev + 1) % filteredActions.length
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredActions.length === 0 ? 0 : (prev - 1 + filteredActions.length) % filteredActions.length
        );
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const action = filteredActions[Math.min(selectedIndex, Math.max(filteredActions.length - 1, 0))];
        if (!action) return;
        action.run();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredActions, handleClose, isOpen, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-950/35 backdrop-blur-[2px]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-[14%] z-[80] w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.55)]"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                autoFocus
                placeholder="Search commands..."
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                aria-label="Search commands"
              />
              <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Esc
              </span>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">No commands found</p>
              ) : (
                filteredActions.map((action, index) => (
                  <button
                    key={action.id}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      action.run();
                      handleClose();
                    }}
                    className={cn(
                      "flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition-colors",
                      index === selectedIndex
                        ? "bg-accent/10 text-slate-800"
                        : "text-slate-600 hover:bg-slate-100/70"
                    )}
                  >
                    <span className="text-sm font-semibold">{action.title}</span>
                    <span className="text-xs text-slate-500">{action.description}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}