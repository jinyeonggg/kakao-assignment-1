'use client';

import type { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  loading: boolean;
  onToggleDone: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveEdit: (id: number, text: string) => void;
}

export default function TodoList({ todos, loading, onToggleDone, onDelete, onSaveEdit }: Props) {
  if (loading) {
    return (
      <div className="px-8 pt-4 pb-7 min-h-[120px] flex items-center justify-center">
        <p className="text-[0.95rem] text-text-muted">불러오는 중...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="px-8 pt-4 pb-7 min-h-[120px] flex items-center justify-center">
        <p className="text-[0.95rem] text-text-muted tracking-wide">할 일이 없습니다 🎉</p>
      </div>
    );
  }

  return (
    <div className="px-8 pt-4 pb-7">
      <ul className="flex flex-col gap-2.5 list-none">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleDone={onToggleDone}
            onDelete={onDelete}
            onSaveEdit={onSaveEdit}
          />
        ))}
      </ul>
    </div>
  );
}
