'use client';

import { useState } from 'react';

interface Props {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: Props) {
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (showWarning && e.target.value.trim()) {
      setShowWarning(false);
    }
  }

  return (
    <section className="px-8 py-5 border-b border-border">
      <div className="flex gap-2.5">
        <input
          type="text"
          className="flex-1 h-[46px] px-4 font-sans text-[0.95rem] text-text-main bg-app-bg border-[1.5px] border-border rounded-input outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_#672be022] placeholder:text-text-muted"
          placeholder="새로운 할 일을 입력하세요..."
          value={value}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          maxLength={100}
          autoComplete="off"
        />
        <button
          className="h-[46px] px-5 font-sans text-[0.9rem] font-semibold text-white bg-primary rounded-btn shadow-btn whitespace-nowrap transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
          onClick={handleAdd}
        >
          추가
        </button>
      </div>
      {showWarning && (
        <p className="mt-1.5 text-[0.82rem] text-danger">할 일을 입력해주세요.</p>
      )}
    </section>
  );
}
