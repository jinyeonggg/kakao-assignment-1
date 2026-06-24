# 작업 계획 — todo-nextjs

---

## ✅ 완료 1 — todo-react → todo-nextjs 마이그레이션

### 무엇이 바뀌었나

| 항목 | todo-react | todo-nextjs |
|------|-----------|-------------|
| 프레임워크 | React + Vite | Next.js 14 (App Router) |
| 언어 | JavaScript | TypeScript |
| 데이터 저장 | localStorage | FastAPI + SQLite |
| 스타일 | CSS | Tailwind CSS |

### 이전한 것

- 컴포넌트 5개: `DateNav`, `FilterTabs`, `TodoInput`, `TodoItem`, `TodoList` → `.tsx`로 변환
- 훅 2개: `useDateNav`, `useTodos` → `.ts`로 변환, `useTodos`는 localStorage → fetch API로 교체
- 유틸: `dateUtils` → `.ts`로 변환

### 새로 추가된 것

- `types/todo.ts` — Todo, FilterKey, TodoCounts 타입 정의
- `app/api/todos/route.ts` — GET / POST (Next.js → FastAPI 프록시)
- `app/api/todos/[id]/route.ts` — PATCH / DELETE 프록시
- `app/todos/error.tsx`, `loading.tsx` — 에러 바운더리 / 스켈레톤 UI
- `backend/main.py` — FastAPI 라우터 + SQLite
- `backend/requirements.txt`, `.env`

---

## ✅ 완료 2 — 예외처리 정비 (todo-react)

**배경:** `storageUtils.js`에서 `console.warn`으로 에러를 삼키고 있어서
사용자가 저장/로드 실패를 알 수 없었음.
"에러는 하위가 아닌 상위에서 관리한다"는 방향으로 구조를 개선했다.

**흐름:**
```
storageUtils.js  →  throw (직접 처리 X)
useTodos.js      →  tryLoad()로 catch → error 상태 노출
App.jsx          →  error 상태를 error banner로 표시
```

**수정한 파일:**

- `src/utils/storageUtils.js` — try-catch / console.warn 제거, 에러를 호출자에게 throw
- `src/hooks/useTodos.js` — tryLoad() 헬퍼 추가, _initial 패턴으로 초기값 분리, error 상태 반환, saveToStorage try-catch 추가
- `src/App.jsx` — 중복 `useTodos()` 호출 제거(버그), error banner 렌더링 추가
- `src/App.css` — `.error-banner` 스타일 추가

---

