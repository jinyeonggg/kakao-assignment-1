import { useState, useEffect, useCallback } from 'react';
import { formatDateKey } from '@/utils/dateUtils';
import type { Todo, FilterKey, TodoCounts } from '@/types/todo';

export function useTodos(selectedDate: Date) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateKey = formatDateKey(selectedDate);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/todos?date=${dateKey}`)
      .then(r => {
        if (!r.ok) throw new Error('서버 오류');
        return r.json();
      })
      .then((data: Todo[]) => setTodos(data))
      .catch(() => setError('할 일을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [dateKey]);

  const todayTodos = todos;

  const filteredTodos = todayTodos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  });

  const remaining = todayTodos.filter(t => !t.done).length;

  const counts: TodoCounts = {
    all: todayTodos.length,
    active: remaining,
  };

  const addTodo = useCallback(async (text: string) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date: dateKey }),
    });
    if (!res.ok) return;
    const todo: Todo = await res.json();
    setTodos(prev => [...prev, todo]);
  }, [dateKey]);

  const toggleDone = useCallback(async (id: number) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    const newDone = !target.done;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: newDone } : t));
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: newDone }),
    });
    if (!res.ok) {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, done: target.done } : t));
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id: number) => {
    const snapshot = todos;
    setTodos(prev => prev.filter(t => t.id !== id));
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setTodos(snapshot);
    }
  }, [todos]);

  const saveEdit = useCallback(async (id: number, text: string) => {
    const snapshot = todos;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      setTodos(snapshot);
    }
  }, [todos]);

  return {
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
  };
}
