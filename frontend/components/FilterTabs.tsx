'use client';

import type { FilterKey, TodoCounts } from '@/types/todo';

const FILTERS: { key: FilterKey; label: string; badge: boolean }[] = [
  { key: 'all', label: '전체', badge: true },
  { key: 'active', label: '진행 중', badge: true },
  { key: 'done', label: '완료', badge: false },
];

interface Props {
  currentFilter: FilterKey;
  counts: TodoCounts;
  onFilterChange: (filter: FilterKey) => void;
}

export default function FilterTabs({ currentFilter, counts, onFilterChange }: Props) {
  return (
    <nav className="flex gap-1 px-8 py-3.5 border-b border-border bg-app-bg">
      {FILTERS.map(({ key, label, badge }) => {
        const isActive = currentFilter === key;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={[
              'inline-flex items-center gap-[7px] h-[34px] px-3.5 font-sans text-[0.85rem] border-[1.5px] rounded-[20px] cursor-pointer transition-all duration-200',
              isActive
                ? 'font-semibold text-white bg-primary border-primary shadow-btn hover:bg-primary-hover hover:border-primary-hover'
                : 'font-medium text-text-muted bg-transparent border-transparent hover:text-primary hover:bg-primary-dim',
            ].join(' ')}
          >
            {label}
            {badge && (
              <span
                className={[
                  'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[0.72rem] font-bold rounded-[9px] transition-all duration-200',
                  isActive ? 'bg-white/[0.28] text-white' : 'bg-primary-dim text-primary',
                ].join(' ')}
              >
                {counts[key as keyof TodoCounts] ?? 0}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
