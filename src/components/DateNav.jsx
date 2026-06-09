import { formatDateDisplay } from '../utils/dateUtils';

export default function DateNav({ selectedDate, isToday, onPrev, onNext, onGoToday }) {
  return (
    <section className="date-nav">
      <button className="btn-date-arrow" onClick={onPrev} aria-label="이전 날짜">&#8592;</button>

      <div className="date-display">
        {isToday && <span className="today-badge">오늘</span>}
        <span className="date-label">{formatDateDisplay(selectedDate)}</span>
      </div>

      <button className="btn-date-arrow" onClick={onNext} aria-label="다음 날짜">&#8594;</button>

      {!isToday && (
        <button className="btn-go-today" onClick={onGoToday}>오늘로</button>
      )}
    </section>
  );
}
