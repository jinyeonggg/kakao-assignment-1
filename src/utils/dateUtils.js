export function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateDisplay(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
}

export function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}
