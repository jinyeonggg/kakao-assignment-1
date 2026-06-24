'use client';

import { useDateNav } from '@/hooks/useDateNav';
import { useTodos } from '@/hooks/useTodos';
import DateNav from './DateNav';
import FilterTabs from './FilterTabs';
import TodoInput from './TodoInput';
import TodoList from './TodoList';

export default function TodoPageClient() {
  const { selectedDate, isToday, goToPrev, goToNext, goToday } = useDateNav();
  const {
    filteredTodos,
    filter,
    setFilter,
    counts,
    remaining,
    loading,
    error,
    addTodo,
    toggleDone,
    deleteTodo,
    saveEdit,
  } = useTodos(selectedDate);

  return (
    <div className="w-full max-w-[560px] bg-surface rounded-card shadow-card border border-border overflow-hidden relative animate-fade-up">
      <header className="flex items-baseline justify-between px-8 pt-7 pb-4 border-b border-border">
        <h1
          className="font-serif text-[2rem] text-primary tracking-tight"
          style={{ textShadow: '0 2px 12px rgba(103,43,224,0.15)' }}
        >
          Todo
        </h1>
        <span className="text-[0.8rem] font-semibold text-text-muted tracking-wide">
          {remaining}개 남음
        </span>
      </header>

      <DateNav
        selectedDate={selectedDate}
        isToday={isToday}
        onPrev={goToPrev}
        onNext={goToNext}
        onGoToday={goToday}
      />

      <TodoInput onAdd={addTodo} />

      <FilterTabs currentFilter={filter} counts={counts} onFilterChange={setFilter} />

      {error && (
        <p className="px-8 py-3 text-sm text-danger border-b border-border">{error}</p>
      )}

      <TodoList
        todos={filteredTodos}
        loading={loading}
        onToggleDone={toggleDone}
        onDelete={deleteTodo}
        onSaveEdit={saveEdit}
      />
    </div>
  );
}
