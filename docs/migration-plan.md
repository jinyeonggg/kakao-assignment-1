# Context

Vanilla JS Todo 앱(`todo-vanilla`)을 React로 마이그레이션한다.
4가지 기능을 순서대로 구현하며, 각 기능별 상태 관리 방식은 요구사항에 명시된 대로 따른다.
기존 `style.css`를 그대로 재사용해 스타일 작업을 최소화한다.

---

# 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 빌드 도구 | **Vite** | CRA deprecated |
| 언어 | **JavaScript** | 도메인 모델 단순, TS 도입 비용 불필요 |
| CSS | **글로벌 CSS 재사용** | 기존 style.css → App.css 이름만 변경, `class` → `className` |
| 상태 관리 | **useState** (요구사항 명시) | filter, selectedDate 모두 useState |
| localStorage | **useEffect** (요구사항 명시) | todos 변경 시 자동 저장 |

---

# 디렉토리 구조

```
todo-react/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx               # 모든 상태 소유 (todos, filter, selectedDate)
    ├── App.css               # 기존 style.css 복사 + .input-warning 추가
    ├── components/
    │   ├── DateNav.jsx
    │   ├── TodoInput.jsx     # 빈 입력 시 안내 메시지 (showWarning 로컬 상태)
    │   ├── FilterTabs.jsx
    │   ├── TodoList.jsx
    │   └── TodoItem.jsx      # isEditing, editValue 로컬 상태
    └── utils/
        ├── dateUtils.js      # getToday, formatDateKey, formatDateDisplay, isSameDay
        └── storageUtils.js   # saveToStorage, loadFromStorage (기존 키 유지)
```

---

# 상태 위치

| 상태 | 위치 | 요구사항 근거 |
|------|------|--------------|
| `todos` | `useState` in App.jsx | useEffect로 localStorage 동기화 |
| `filter` | `useState` in App.jsx | "필터 상태는 useState로 관리" |
| `selectedDate` | `useState` in App.jsx | "선택된 날짜 상태는 useState로 관리" |
| `inputValue`, `showWarning` | `useState` in TodoInput | 로컬 UI 상태 |
| `isEditing`, `editValue` | `useState` in TodoItem | 로컬 UI 상태 |

---

# 핵심 구현 사항

## App.jsx 상태 & 로직

```js
const [todos, setTodos] = useState(() => loadFromStorage());  // lazy init
const [filter, setFilter] = useState('all');
const [selectedDate, setSelectedDate] = useState(getToday());

// todos 변경 시 자동 저장
useEffect(() => {
  saveToStorage(todos);
}, [todos]);

// 현재 날짜의 todos만 필터
const dateKey = formatDateKey(selectedDate);
const todayTodos = todos.filter(t => t.date === dateKey);
const filteredTodos = todayTodos.filter(t => {
  if (filter === 'active') return !t.done;
  if (filter === 'done') return t.done;
  return true;
});
```

## CRUD 요구사항

- **추가**: 빈 입력이면 Todo 생성 안 함 + `showWarning = true`로 안내 메시지 표시
- **수정**: `prompt()` 아닌 인라인 입력창, ESC → 취소, Enter/저장 버튼 → 저장
- **완료**: 체크박스 토글, `done: true`인 경우 텍스트에 취소선
- **삭제**: 삭제 버튼

## TodoInput (빈 입력 안내)

```jsx
function handleAdd() {
  if (!value.trim()) {
    setShowWarning(true);   // ← 안내 메시지 표시
    return;
  }
  onAdd(value.trim());
  setValue('');
  setShowWarning(false);
}
// 입력 중 경고 숨김
onChange: setValue(e.target.value); if (showWarning && value.trim()) setShowWarning(false);
```

## FilterTabs 요구사항

- 탭 전환 후 새 Todo 추가해도 필터 유지 (필터를 date 변경 시 초기화하지 않음)
- 선택된 탭: `active` 클래스로 시각 구분
- 전체/진행 중 탭에는 카운트 배지, 완료 탭은 배지 없음 (vanilla 원본과 동일)

## DateNav 요구사항

- 오늘 날짜이면 `today-badge` 표시, `오늘로` 버튼 숨김
- 다른 날짜이면 `오늘로` 버튼 표시
- Todo 생성 시 현재 `selectedDate`의 dateKey가 자동으로 항목에 저장됨

## localStorage

```js
// storageUtils.js - 기존 vanilla 앱과 동일한 키 → 데이터 유지
const STORAGE_KEY = 'todo_items';  // vanilla와 동일

// App.jsx lazy init → 초기 렌더 flash 없이 복원
useState(() => loadFromStorage())
```

---

# 컴포넌트 Props

| 컴포넌트 | Props |
|----------|-------|
| `DateNav` | `selectedDate, isToday, onPrev, onNext, onGoToday` |
| `TodoInput` | `onAdd(text)` |
| `FilterTabs` | `currentFilter, counts, onFilterChange` |
| `TodoList` | `todos, onToggleDone, onDelete, onSaveEdit` |
| `TodoItem` | `todo, onToggleDone, onDelete, onSaveEdit` |

---

# CSS 추가 (App.css에만)

기존 style.css 전체 복사 후 아래 1개 클래스만 추가:

```css
.input-warning {
  margin-top: 6px;
  font-size: 0.82rem;
  color: var(--color-danger);
}
```

---

# 구현 순서

1. Vite 프로젝트 생성 + 의존성 설치
2. `src/utils/dateUtils.js`, `storageUtils.js`
3. `src/App.css` (style.css 복사 + .input-warning 추가)
4. `FilterTabs.jsx`, `DateNav.jsx` (순수 표현 컴포넌트)
5. `TodoInput.jsx` (showWarning 로컬 상태)
6. `TodoItem.jsx` (isEditing, editValue, ref, ESC/Enter 처리)
7. `TodoList.jsx` (TodoItem 렌더링 + 빈 상태)
8. `App.jsx` (상태 조립)
9. `main.jsx`, `index.html`

---

# 검증 체크리스트

- [x] 빈 입력 → 안내 메시지 표시, Todo 미생성
- [x] 인라인 편집: ESC 취소 / Enter 저장 / 빈 값 저장 불가
- [x] 완료 Todo: 취소선 표시
- [x] 필터 탭: 전환 후 새 Todo 추가 시 필터 유지
- [x] 날짜 이전/다음/오늘로 동작
- [x] 각 날짜별 Todo 분리 표시
- [x] 새로고침 후 데이터 유지 (localStorage)
