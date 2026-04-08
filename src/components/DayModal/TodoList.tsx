import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import TodoItem from "./TodoItem";
import { TodoItem as TodoItemType } from "@/types";

interface TodoListProps {
  todos: TodoItemType[];
  onTodosChange: (newTodos: TodoItemType[]) => void;
}

export default function TodoList({ todos, onTodosChange }: TodoListProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    
    const newTodo: TodoItemType = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      details: "",
      createdAt: new Date().toISOString(),
    };
    
    onTodosChange([...todos, newTodo]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleToggle = (id: string) => {
    onTodosChange(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    onTodosChange(todos.filter((t) => t.id !== id));
  };

  const handleUpdateDetails = (id: string, details: string) => {
    onTodosChange(
      todos.map((t) => (t.id === id ? { ...t, details } : t))
    );
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="mt-8">
      <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-widest mb-4">
        Action Items
      </h3>

      <div className="flex items-center gap-2 mb-6 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New task..."
          className="flex-1 bg-surface-hover/80 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm text-white placeholder:text-textSecondary/50 focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-accent hover:bg-accentHover disabled:bg-white/5 disabled:text-textSecondary/30 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg disabled:shadow-none"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-sm text-textSecondary/40 text-center py-6 italic font-serif">
          The agenda is clear.
        </p>
      ) : (
        <div className="flex flex-col">
          <AnimatePresence>
            {activeTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdateDetails={handleUpdateDetails}
              />
            ))}
          </AnimatePresence>

          {completedTodos.length > 0 && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-bold text-textSecondary/60 uppercase tracking-widest">
                  Completed
                </span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <AnimatePresence>
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdateDetails={handleUpdateDetails}
                  />
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </div>
  );
}
