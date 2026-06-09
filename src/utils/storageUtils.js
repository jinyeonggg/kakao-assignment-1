const STORAGE_KEY = 'todo_items';

export function saveToStorage(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.warn('로컬스토리지 저장 실패:', e);
  }
}

export function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('로컬스토리지 불러오기 실패:', e);
    return [];
  }
}
