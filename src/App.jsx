import { useState, useEffect } from 'react';
import DateNav from './components/DateNav';
import TodoInput from './components/TodoInput';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';
import useDateNav from './hooks/useDateNav';
import useTodos from './hooks/useTodos';

export default function App() {
  const { selectedDate, isToday, goToPrev, goToNext, goToday } = useDateNav();
  const { filteredTodos, filter, setFilter, counts, remaining, addTodo, toggleDone, deleteTodo, saveEdit } = useTodos(selectedDate);
  useTodos(selectedDate);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="app-title">Todo</h1>
        <span className="todo-count">{remaining}개 남음</span>
      </header>

      <DateNav
        selectedDate={selectedDate}
        isToday={isToday}
        onPrev={goToPrev}
        onNext={goToNext}
        onGoToday={goToday}
      />

      <TodoInput onAdd={addTodo} />

      <FilterTabs
        currentFilter={filter}
        counts={counts}
        onFilterChange={setFilter}
      />

      <TodoList
        todos={filteredTodos}
        onToggleDone={toggleDone}
        onDelete={deleteTodo}
        onSaveEdit={saveEdit}
      />
    </div>
  );
}
