import { useState, useEffect, useRef } from 'react';

export default function TodoItem({ todo, onToggleDone, onDelete, onSaveEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef(null);

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

  const itemClass = ['todo-item', todo.done ? 'done' : ''].filter(Boolean).join(' ');

  return (
    <li className={itemClass}>
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
          className="todo-edit-input"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          maxLength={100}
        />
      ) : (
        <span className="todo-text">{todo.text}</span>
      )}

      <div className="item-actions">
        {isEditing ? (
          <>
            <button className="btn btn-icon btn-save" onClick={handleSave}>저장</button>
            <button className="btn btn-icon btn-delete" onClick={handleCancel}>✕</button>
          </>
        ) : (
          <>
            <button className="btn btn-icon btn-edit" onClick={startEdit} aria-label="수정">✎</button>
            <button className="btn btn-icon btn-delete" onClick={() => onDelete(todo.id)} aria-label="삭제">✕</button>
          </>
        )}
      </div>
    </li>
  );
}
