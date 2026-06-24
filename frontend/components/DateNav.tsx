'use client';

import { formatDateDisplay } from '@/utils/dateUtils';

interface Props {
  selectedDate: Date;
  isToday: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoToday: () => void;
}

export default function DateNav({ selectedDate, isToday, onPrev, onNext, onGoToday }: Props) {
  return (
    <section className="flex items-center gap-2.5 px-6 py-3.5 border-b border-border bg-surface">
      <button
        className="w-[34px] h-[34px] flex items-center justify-center text-text-muted bg-app-bg border-[1.5px] border-border rounded-btn cursor-pointer flex-shrink-0 transition-all duration-200 hover:text-primary hover:border-primary hover:bg-primary-dim active:scale-[0.94]"
        onClick={onPrev}
        aria-label="이전 날짜"
      >
        ←
      </button>

      <div className="flex-1 flex items-center justify-center gap-2">
        {isToday && (
          <span className="inline-flex items-center px-[9px] py-[2px] text-[0.72rem] font-bold text-white bg-primary rounded-[20px] shadow-[0_1px_6px_rgba(103,43,224,0.3)]">
            오늘
          </span>
        )}
        <span className="text-[0.95rem] font-semibold text-text-main tracking-[-0.01em] whitespace-nowrap">
          {formatDateDisplay(selectedDate)}
        </span>
      </div>

      <button
        className="w-[34px] h-[34px] flex items-center justify-center text-text-muted bg-app-bg border-[1.5px] border-border rounded-btn cursor-pointer flex-shrink-0 transition-all duration-200 hover:text-primary hover:border-primary hover:bg-primary-dim active:scale-[0.94]"
        onClick={onNext}
        aria-label="다음 날짜"
      >
        →
      </button>

      {!isToday && (
        <button
          className="flex-shrink-0 h-[30px] px-3 font-sans text-[0.78rem] font-semibold text-primary bg-primary-dim border-[1.5px] border-transparent rounded-[20px] cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-primary hover:text-white"
          onClick={onGoToday}
        >
          오늘로
        </button>
      )}
    </section>
  );
}
