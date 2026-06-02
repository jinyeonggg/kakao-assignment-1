/* ============================================================
   app.js  —  Todo 앱 CRUD + 필터링 + 다중 선택 + 일간 뷰
              + 로컬스토리지 연동
   ============================================================ */

// ── DOM 참조 ──────────────────────────────────────────────────
const todoInput      = document.getElementById('todoInput');
const addButton      = document.getElementById('addButton');
const todoList       = document.getElementById('todoList');
const emptyState     = document.getElementById('emptyState');
const todoCount      = document.getElementById('todoCount');
const filterTabs     = document.getElementById('filterTabs');
const badgeAll       = document.getElementById('badgeAll');
const badgeActive    = document.getElementById('badgeActive');

// 날짜 네비게이터
const prevDateBtn    = document.getElementById('prevDateBtn');
const nextDateBtn    = document.getElementById('nextDateBtn');
const dateLabel      = document.getElementById('dateLabel');
const todayBadge     = document.getElementById('todayBadge');
const goTodayBtn     = document.getElementById('goTodayBtn');

// 일괄 액션 바
const bulkActionBar  = document.getElementById('bulkActionBar');
const bulkCount      = document.getElementById('bulkCount');
const bulkDoneBtn    = document.getElementById('bulkDoneBtn');
const bulkDeleteBtn  = document.getElementById('bulkDeleteBtn');
const clearSelectBtn = document.getElementById('clearSelectBtn');

// ── 로컬스토리지 키 상수 ──────────────────────────────────────
/**
 * 로컬스토리지에 사용할 키 이름을 상수로 관리한다.
 * 키를 한 곳에서 관리해 오타나 불일치를 방지한다.
 */
const STORAGE_KEY_ITEMS  = 'todo_items';   // todoItems 배열 저장 키
const STORAGE_KEY_NEXTID = 'todo_next_id'; // nextId 카운터 저장 키

// ── 로컬스토리지 함수 ─────────────────────────────────────────

/**
 * 현재 todoItems 배열과 nextId를 로컬스토리지에 저장한다.
 * JSON.stringify로 직렬화해 문자열로 저장한다.
 * 상태가 바뀌는 모든 동작(추가/수정/삭제/완료) 직후에 호출한다.
 */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS,  JSON.stringify(todoItems));
    localStorage.setItem(STORAGE_KEY_NEXTID, JSON.stringify(nextId));
  } catch (e) {
    // 시크릿 모드나 스토리지 용량 초과 등의 예외를 조용히 처리
    console.warn('로컬스토리지 저장 실패:', e);
  }
}

/**
 * 로컬스토리지에서 데이터를 불러와 todoItems와 nextId를 복원한다.
 * JSON.parse로 역직렬화한다.
 * 페이지 최초 로드 시 한 번 호출된다.
 */
function loadFromStorage() {
  try {
    const storedItems  = localStorage.getItem(STORAGE_KEY_ITEMS);
    const storedNextId = localStorage.getItem(STORAGE_KEY_NEXTID);

    // 저장된 항목이 있으면 파싱해 복원, 없으면 빈 배열 유지
    if (storedItems !== null) {
      todoItems = JSON.parse(storedItems);
    }

    // 저장된 ID 카운터가 있으면 복원, 없으면 기본값 1 유지
    if (storedNextId !== null) {
      nextId = JSON.parse(storedNextId);
    }
  } catch (e) {
    // 손상된 데이터가 저장돼 있을 경우 초기 상태로 fallback
    console.warn('로컬스토리지 불러오기 실패, 초기화합니다:', e);
    todoItems = [];
    nextId    = 1;
  }
}

// ── 상태 ──────────────────────────────────────────────────────
/**
 * todoItems: Todo 항목 배열
 * 각 항목의 구조: { id, text, done, date }
 * date: 'YYYY-MM-DD' 형식의 문자열
 */
let todoItems = [];

/** 자동 증가 ID 카운터 */
let nextId = 1;

/** 현재 필터: 'all' | 'active' | 'done' */
let currentFilter = 'all';

/** 다중 선택된 항목 ID의 Set (선택 상태는 저장하지 않는다) */
let selectedIds = new Set();

/**
 * selectedDate: 현재 일간 뷰에서 보고 있는 날짜
 * Date 객체로 관리하며, 시간은 항상 00:00:00으로 정규화한다.
 */
let selectedDate = getToday();

// ── 초기화 ────────────────────────────────────────────────────
// ① 로컬스토리지에서 저장된 데이터 복원
loadFromStorage();
// ② 날짜 UI 렌더
updateDateNav();
// ③ 목록 렌더 (복원된 데이터 기반)
renderList();

// ── 이벤트 리스너 ─────────────────────────────────────────────

/** 입력창 값 변경 → 추가 버튼 활성/비활성 */
todoInput.addEventListener('input', () => {
  addButton.disabled = todoInput.value.trim() === '';
});

/** Enter 키로 Todo 추가 */
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !addButton.disabled) addTodo();
});

/** 추가 버튼 클릭 */
addButton.addEventListener('click', () => addTodo());

/** ← 이전 날짜 버튼 */
prevDateBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() - 1);
  onDateChanged();
});

/** → 다음 날짜 버튼 */
nextDateBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() + 1);
  onDateChanged();
});

/** "오늘로" 바로가기 버튼 */
goTodayBtn.addEventListener('click', () => {
  selectedDate = getToday();
  onDateChanged();
});

/** 필터 탭 클릭 — 이벤트 위임 */
filterTabs.addEventListener('click', (e) => {
  const clickedTab = e.target.closest('.tab-btn');
  if (!clickedTab) return;

  const newFilter = clickedTab.dataset.filter;
  if (newFilter === currentFilter) return;

  currentFilter = newFilter;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  clickedTab.classList.add('active');

  clearSelection();
  renderList();
});

/** 일괄 완료 처리 */
bulkDoneBtn   .addEventListener('click', () => bulkMarkDone());
/** 일괄 삭제 */
bulkDeleteBtn .addEventListener('click', () => bulkDelete());
/** 선택 전체 해제 */
clearSelectBtn.addEventListener('click', () => { clearSelection(); renderList(); });

// ── 날짜 변경 처리 ────────────────────────────────────────────

/**
 * 날짜가 바뀔 때 실행한다.
 * 날짜 이동은 데이터 변경이 아니므로 saveToStorage는 호출하지 않는다.
 */
function onDateChanged() {
  updateDateNav();
  clearSelection();
  renderList();
}

/**
 * 날짜 네비게이터 UI를 현재 selectedDate에 맞게 갱신한다.
 */
function updateDateNav() {
  dateLabel.textContent = formatDateDisplay(selectedDate);

  const isToday = isSameDay(selectedDate, getToday());
  todayBadge.classList.toggle('hidden', !isToday);
  goTodayBtn.classList.toggle('hidden',  isToday);
}

// ── 핵심 기능 함수 ────────────────────────────────────────────

/**
 * Todo 항목을 생성하고 로컬스토리지에 저장한다.
 */
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  todoItems.push({
    id:   nextId++,
    text,
    done: false,
    date: formatDateKey(selectedDate)
  });

  todoInput.value    = '';
  addButton.disabled = true;
  todoInput.focus();

  saveToStorage(); // ← 항목 추가 후 저장
  renderList();
}

/**
 * 개별 완료 토글 후 저장한다.
 * @param {number} id
 */
function toggleDone(id) {
  const item = findItemById(id);
  if (!item) return;
  item.done = !item.done;

  saveToStorage(); // ← 완료 상태 변경 후 저장
  renderList();
}

/**
 * 개별 삭제 후 저장한다.
 * @param {number} id
 */
function deleteTodo(id) {
  todoItems = todoItems.filter(item => item.id !== id);
  selectedIds.delete(id);

  saveToStorage(); // ← 항목 삭제 후 저장
  renderList();
}

/** 선택용 체크박스 변경 핸들러 (선택 상태는 저장 불필요) */
function handleSelectChange(id, isChecked) {
  if (isChecked) {
    selectedIds.add(id);
  } else {
    selectedIds.delete(id);
  }
  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (listItem) listItem.classList.toggle('selected', isChecked);
  updateBulkBar();
}

/**
 * 선택된 모든 항목을 완료 처리하고 저장한다.
 */
function bulkMarkDone() {
  selectedIds.forEach(id => {
    const item = findItemById(id);
    if (item) item.done = true;
  });
  clearSelection();

  saveToStorage(); // ← 일괄 완료 후 저장
  renderList();
}

/**
 * 선택된 모든 항목을 삭제하고 저장한다.
 */
function bulkDelete() {
  todoItems = todoItems.filter(item => !selectedIds.has(item.id));
  clearSelection();

  saveToStorage(); // ← 일괄 삭제 후 저장
  renderList();
}

/** 선택 상태 초기화 */
function clearSelection() {
  selectedIds.clear();
  updateBulkBar();
}

// ── 수정 기능 ─────────────────────────────────────────────────

function startEditing(id) {
  const item = findItemById(id);
  if (!item) return;

  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  const textEl    = listItem.querySelector('.todo-text');
  const actionsEl = listItem.querySelector('.item-actions');

  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value     = item.text;
  editInput.maxLength = 100;

  textEl.replaceWith(editInput);
  editInput.focus();
  editInput.setSelectionRange(editInput.value.length, editInput.value.length);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEdit(id, editInput.value);
    if (e.key === 'Escape') renderList();
  });

  actionsEl.innerHTML = `
    <button class="btn btn-icon btn-save">저장</button>
    <button class="btn btn-icon btn-delete">✕</button>
  `;

  actionsEl.querySelector('.btn-save')  .addEventListener('click', () => saveEdit(id, editInput.value));
  actionsEl.querySelector('.btn-delete').addEventListener('click', () => deleteTodo(id));
}

/**
 * 수정된 내용을 저장한다.
 * @param {number} id
 * @param {string} newText
 */
function saveEdit(id, newText) {
  const trimmed = (newText || '').trim();
  if (!trimmed) return;

  const item = findItemById(id);
  if (!item) return;

  item.text = trimmed;

  saveToStorage(); // ← 텍스트 수정 후 저장
  renderList();
}

// ── 렌더링 ────────────────────────────────────────────────────

function renderList() {
  todoList.innerHTML = '';

  const filteredItems = getFilteredItems();

  if (filteredItems.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    filteredItems.forEach(item => todoList.appendChild(createListItem(item)));
  }

  updateBadges();
  updateCount();
  updateBulkBar();
}

/**
 * 날짜 필터 → 상태 필터 순서로 항목을 추출한다.
 */
function getFilteredItems() {
  const dateKey  = formatDateKey(selectedDate);
  const byDate   = todoItems.filter(item => item.date === dateKey);

  switch (currentFilter) {
    case 'active': return byDate.filter(item => !item.done);
    case 'done':   return byDate.filter(item =>  item.done);
    default:       return byDate;
  }
}

function createListItem(item) {
  const isSelected = selectedIds.has(item.id);

  const li = document.createElement('li');
  li.className  = ['todo-item', item.done ? 'done' : '', isSelected ? 'selected' : '']
                    .filter(Boolean).join(' ');
  li.dataset.id = item.id;

  li.innerHTML = `
    <input type="checkbox" class="select-checkbox"   ${isSelected ? 'checked' : ''} aria-label="항목 선택" />
    <div class="checkbox-divider"></div>
    <input type="checkbox" class="complete-checkbox" ${item.done  ? 'checked' : ''} aria-label="완료 표시" />
    <span class="todo-text">${escapeHtml(item.text)}</span>
    <div class="item-actions">
      <button class="btn btn-icon btn-edit"   aria-label="수정">✎</button>
      <button class="btn btn-icon btn-delete" aria-label="삭제">✕</button>
    </div>
  `;

  li.querySelector('.select-checkbox') .addEventListener('change', (e) => handleSelectChange(item.id, e.target.checked));
  li.querySelector('.complete-checkbox').addEventListener('change', ()  => toggleDone(item.id));
  li.querySelector('.btn-edit')         .addEventListener('click',  ()  => startEditing(item.id));
  li.querySelector('.btn-delete')       .addEventListener('click',  ()  => deleteTodo(item.id));

  return li;
}

// ── UI 갱신 함수 ──────────────────────────────────────────────

function updateBulkBar() {
  const count = selectedIds.size;
  if (count > 0) {
    bulkActionBar.classList.add('visible');
    bulkCount.textContent = `${count}개 선택됨`;
  } else {
    bulkActionBar.classList.remove('visible');
  }
}

function updateBadges() {
  const dateKey      = formatDateKey(selectedDate);
  const byDate       = todoItems.filter(item => item.date === dateKey);
  badgeAll.textContent    = byDate.length;
  badgeActive.textContent = byDate.filter(item => !item.done).length;
}

function updateCount() {
  const dateKey   = formatDateKey(selectedDate);
  const remaining = todoItems.filter(item => item.date === dateKey && !item.done).length;
  todoCount.textContent = `${remaining}개 남음`;
}

// ── 날짜 유틸 ─────────────────────────────────────────────────

/** 오늘 날짜를 시간 정보 없이 반환한다. */
function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Date → 'YYYY-MM-DD' 문자열
 * 로컬스토리지 저장 키 및 항목의 date 필드로 사용한다.
 */
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Date → "YYYY년 M월 D일 요일" 표시용 문자열 */
function formatDateDisplay(date) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
}

/** 두 Date가 같은 날짜인지 비교한다. */
function isSameDay(a, b) {
  return formatDateKey(a) === formatDateKey(b);
}

// ── 공통 유틸 ─────────────────────────────────────────────────

/** ID로 항목 검색 */
function findItemById(id) {
  return todoItems.find(item => item.id === id);
}

/** XSS 방지 이스케이프 */
function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}