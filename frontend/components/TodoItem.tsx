'use client';

import { useState, useEffect, useRef } from 'react';
import type { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
  onToggleDone: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveEdit: (id: number, text: string) => void;
}

export default function TodoItem({ todo, onToggleDone, onDelete, onSaveEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.focus();
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  function startEdit() {
    setEditValue(todo.text);
    setIsEditing(true);
  }

  function handleSave() {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    onSaveEdit(todo.id, trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditValue(todo.text);
  }

  return (
    <li
      className={[
        'flex items-center gap-2.5 px-4 py-3.5 bg-app-bg border-[1.5px] border-border rounded-item transition-all duration-200 animate-item-in',
        todo.done
          ? 'opacity-65 hover:border-border hover:shadow-none'
          : 'hover:border-primary hover:shadow-[0_2px_12px_rgba(103,43,224,0.08)]',
      ].join(' ')}
    >
      <input
        type="checkbox"
        className="complete-checkbox"
        checked={todo.done}
        onChange={() => onToggleDone(todo.id)}
        aria-label="완료 표시"
      />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="flex-1 h-8 px-2.5 font-sans text-[0.95rem] text-text-main bg-surface border-[1.5px] border-primary rounded-[6px] outline-none shadow-[0_0_0_3px_#672be022]"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          maxLength={100}
        />
      ) : (
        <span
          className={[
            'flex-1 text-[0.95rem] leading-relaxed break-words transition-all duration-200',
            todo.done ? 'line-through text-text-done' : 'text-text-main',
          ].join(' ')}
        >
          {todo.text}
        </span>
      )}

      <div className="flex gap-1.5 flex-shrink-0">
        {isEditing ? (
          <>
            <button
              className="w-8 h-8 flex items-center justify-center text-[0.8rem] font-bold rounded-[7px] bg-primary text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              onClick={handleSave}
            >
              저장
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center text-[0.8rem] font-bold rounded-[7px] bg-[#ffeef2] text-danger transition-all duration-200 hover:bg-danger hover:text-white active:scale-[0.97]"
              onClick={handleCancel}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              className="w-8 h-8 flex items-center justify-center text-[0.8rem] font-bold rounded-[7px] bg-primary-dim text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-[0.97]"
              onClick={startEdit}
              aria-label="수정"
            >
              ✎
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center text-[0.8rem] font-bold rounded-[7px] bg-[#ffeef2] text-danger transition-all duration-200 hover:bg-danger hover:text-white active:scale-[0.97]"
              onClick={() => onDelete(todo.id)}
              aria-label="삭제"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </li>
  );
}
