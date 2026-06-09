import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  function handleAdd() {
    if (!value.trim()) {
      setShowWarning(true);
      return;
    }
    onAdd(value.trim());
    setValue('');
    setShowWarning(false);
  }

  function handleChange(e) {
    setValue(e.target.value);
    if (showWarning && e.target.value.trim()) {
      setShowWarning(false);
    }
  }

  return (
    <section className="input-section">
      <div className="input-row">
        <input
          type="text"
          className="todo-input"
          placeholder="새로운 할 일을 입력하세요..."
          value={value}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          maxLength={100}
          autoComplete="off"
        />
        <button className="btn btn-add" onClick={handleAdd}>추가</button>
      </div>
      {showWarning && (
        <p className="input-warning">할 일을 입력해주세요.</p>
      )}
    </section>
  );
}
