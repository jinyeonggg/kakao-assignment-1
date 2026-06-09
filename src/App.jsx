import { useState, useEffect } from 'react';
import { getToday, formatDateKey, isSameDay } from './utils/dateUtils';
import { loadFromStorage, saveToStorage } from './utils/storageUtils';
import DateNav from './components/DateNav';
import TodoInput from './components/TodoInput';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState(() => loadFromStorage());
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(getToday());

  useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  const dateKey = formatDateKey(selectedDate);
  const isToday = isSameDay(selectedDate, getToday());

  const todayTodos = todos.filter(t => t.date === dateKey);
  const filteredTodos = todayTodos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const counts = {
    all: todayTodos.length,
    active: todayTodos.filter(t => !t.done).length,
  };

  const remaining = todayTodos.filter(t => !t.done).length;

  function addTodo(text) {
    setTodos(prev => {
      const id = prev.length === 0 ? 1 : Math.max(...prev.map(t => t.id)) + 1;
      return [...prev, { id, text, done: false, date: dateKey }];
    });
  }

  function toggleDone(id) {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function saveEdit(id, newText) {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, text: newText } : t)
    );
  }

  function goToPrev() {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  }

  function goToNext() {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  }

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
        onGoToday={() => setSelectedDate(getToday())}
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
