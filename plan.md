# 리팩토링 계획 — todo-nextjs

## 목표

성능 교정 → API 추상화 → 성능 마무리 순서로 진행.
각 Phase는 독립적으로 검증 가능하도록 범위를 최소화했다.

---

## Phase 1 — `useTodos.ts` 교정

**파일 1개만 수정.** 완료 후 toggle/delete/edit이 모두 정상 동작하는지 먼저 확인한다.

### 1-A. `useCallback` deps에서 `todos` 제거

`toggleDone`, `deleteTodo`, `saveEdit`이 현재 `[todos]`를 deps로 갖는다.
todos가 바뀔 때마다 콜백이 새로 만들어져 하위 컴포넌트 전체 리렌더.

수정 패턴: functional setState 안에서 `prev`를 읽고, 롤백 스냅샷도 내부에서 캡처.

```ts
const toggleDone = useCallback(async (id: number) => {
  let previousDone: boolean | undefined;
  setTodos(prev => {
    const target = prev.find(t => t.id === id);
    if (!target) return prev;
    previousDone = target.done;
    return prev.map(t => t.id === id ? { ...t, done: !target.done } : t);
  });
  if (previousDone === undefined) return;
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !previousDone }),
  });
  if (!res.ok) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: previousDone! } : t));
  }
}, []); // deps 비움
```

`deleteTodo`, `saveEdit`도 동일하게 스냅샷을 setTodos 내부에서 캡처.

### 1-B. AbortController로 메모리 누수 차단

```ts
useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  fetch(`/api/todos?date=${dateKey}`, { signal: controller.signal })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then((data: Todo[]) => setTodos(data))
    .catch(err => { if (err.name !== 'AbortError') setError('불러오기 실패'); })
    .finally(() => setLoading(false));
  return () => controller.abort();
}, [dateKey]);
```

### 1-C. `useMemo` 추가

```ts
const filteredTodos = useMemo(() => {
  if (filter === 'active') return todos.filter(t => !t.done);
  if (filter === 'done') return todos.filter(t => t.done);
  return todos;
}, [todos, filter]);

const counts = useMemo<TodoCounts>(() => ({
  all: todos.length,
  active: todos.filter(t => !t.done).length,
}), [todos]);
```

### 1-D. `addTodo` 실패 시 에러 노출

현재 `if (!res.ok) return;`으로 조용히 실패한다. `setError('추가 실패')` 추가.

---

## Phase 2 — API 추상화 레이어

**새 파일 1개 생성** (`frontend/lib/api.ts`), `useTodos.ts` fetch 4개를 교체.

### `frontend/lib/api.ts` 생성

```ts
import type { Todo } from '@/types/todo';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export const todoApi = {
  list: (date: string, signal?: AbortSignal): Promise<Todo[]> =>
    request(`/api/todos?date=${date}`, { signal }),

  create: (text: string, date: string): Promise<Todo> =>
    request('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date }),
    }),

  patch: (id: number, patch: Partial<Pick<Todo, 'done' | 'text'>>): Promise<Todo> =>
    request(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }),

  delete: (id: number): Promise<void> =>
    fetch(`/api/todos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
```

`useTodos.ts`의 inline fetch들을 `todoApi.*`로 교체. catch 블록에 `(error: unknown)` 타입 추가.

---

## Phase 3 — 성능 마무리

Phase 1 완료 후 진행 (콜백 안정화가 선행되어야 React.memo가 효과 있음).

### 3-A. `React.memo` — `TodoItem.tsx`

```ts
export default React.memo(function TodoItem(...) { ... });
```

### 3-B. `isToday` 메모이제이션 — `useDateNav.ts`

```ts
const isToday = useMemo(() => isSameDay(selectedDate, getToday()), [selectedDate]);
```

### 3-C. 버튼 클래스 상수화 — `TodoItem.tsx`

반복되는 Tailwind 클래스를 파일 상단 const로 추출.

```ts
const BTN_BASE = 'w-8 h-8 flex items-center justify-center text-[0.8rem] font-bold rounded-[7px] transition-all duration-200 active:scale-[0.97]';
const BTN_PRIMARY = `${BTN_BASE} bg-primary-dim text-primary hover:bg-primary hover:text-white`;
const BTN_DANGER  = `${BTN_BASE} bg-[#ffeef2] text-danger hover:bg-danger hover:text-white`;
```

---

## 수정 파일 목록

| Phase | 파일 | 변경 |
|-------|------|------|
| 1 | `frontend/hooks/useTodos.ts` | deps 교정, AbortController, useMemo, addTodo 에러 |
| 2 | `frontend/lib/api.ts` | **신규** |
| 2 | `frontend/hooks/useTodos.ts` | fetch → todoApi 교체 |
| 3 | `frontend/components/TodoItem.tsx` | React.memo, 버튼 상수 |
| 3 | `frontend/hooks/useDateNav.ts` | isToday useMemo |

---

## 검증 방법

**Phase 1 후**
- todo toggle/delete/edit → 낙관적 업데이트 정상 동작
- 날짜 빠르게 전환 → 네트워크 탭에서 이전 요청 `canceled` 표시 확인
- 저장 실패 시 에러 메시지 노출 확인

**Phase 3 후**
- React DevTools Profiler에서 TodoItem 리렌더 감소 확인
