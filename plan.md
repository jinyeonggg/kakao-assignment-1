# plan.md — todo-nextjs

---

## 1. 프로젝트 개요

**무엇을 만드는지**
날짜별 할 일을 관리하는 풀스택 웹 앱.
날짜 네비게이션, 상태 필터링(전체/진행중/완료), 인라인 편집을 지원한다.

**왜 만드는지**
기존 todo-react(localStorage 기반)를 Next.js + FastAPI 풀스택 구조로 마이그레이션하며
서버 사이드 데이터 관리, API 설계, TypeScript 전환을 직접 경험하기 위해.

---

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLite, Python |
| 상태 관리 | React Hooks (useState, useEffect, useCallback) |
| 스타일 | Tailwind CSS (커스텀 퍼플 테마 `#672be0`) |

---

## 3. 기능 목록

- [x] 투두 추가
- [x] 투두 완료 체크
- [x] 날짜별 조회
- [x] 투두 삭제
- [x] 투두 인라인 편집
- [x] 상태 필터링 (전체 / 진행 중 / 완료)
- [x] 날짜 네비게이션 (이전 / 다음 / 오늘)
- [x] 낙관적 업데이트 (toggle / delete / edit)

---

## 4. 폴더 구조

```
todo-nextjs/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                  # /todos로 리다이렉트
│   │   ├── layout.tsx
│   │   ├── todos/
│   │   │   ├── page.tsx              # 메인 페이지 (서버 컴포넌트)
│   │   │   ├── error.tsx             # 에러 바운더리
│   │   │   └── loading.tsx           # 스켈레톤 UI
│   │   └── api/todos/
│   │       ├── route.ts              # GET / POST
│   │       └── [id]/route.ts         # PATCH / DELETE
│   ├── components/
│   │   ├── TodoPageClient.tsx        # 훅 조합 + 레이아웃 (클라이언트 컴포넌트)
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoInput.tsx
│   │   ├── FilterTabs.tsx
│   │   └── DateNav.tsx
│   ├── hooks/
│   │   ├── useTodos.ts               # CRUD + 필터 + API 통신
│   │   └── useDateNav.ts             # 날짜 state + 이동 로직
│   ├── types/
│   │   └── todo.ts                   # Todo, FilterKey, TodoCounts
│   └── utils/
│       └── dateUtils.ts              # 날짜 포맷 / 비교
└── backend/
    ├── main.py                       # FastAPI 라우터 + SQLite
    ├── requirements.txt
    └── .env                          # DATABASE_URL, FRONTEND_URL
```

---

## 5. API 명세

Next.js API Routes(`/api/todos/*`)가 FastAPI로 프록시한다.

| Method | Path | 설명 |
|--------|------|------|
| GET | `/todos?date=YYYY-MM-DD` | 날짜별 목록 조회 |
| POST | `/todos` | 투두 생성 |
| PATCH | `/todos/{id}` | 텍스트 또는 완료 상태 수정 |
| DELETE | `/todos/{id}` | 투두 삭제 |

**DB 스키마**
```sql
CREATE TABLE todos (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT    NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  date TEXT    NOT NULL
);
```

---

## 6. 개발 순서 / 일정

### ✅ 완료

**1단계 — todo-react → todo-nextjs 마이그레이션**
- 컴포넌트 5개 `.tsx` 변환 (DateNav, FilterTabs, TodoInput, TodoItem, TodoList)
- 훅 2개 `.ts` 변환, `useTodos`는 localStorage → fetch API로 교체
- `types/todo.ts` 타입 정의 추가
- Next.js API Routes 추가 (FastAPI 프록시)
- FastAPI + SQLite 백엔드 구축

**2단계 — 예외처리 정비 (todo-react)**
- `storageUtils.js`: `console.warn` 제거 → 에러를 호출자에게 throw
- `useTodos.js`: `tryLoad()` 헬퍼로 초기값 분리, `error` 상태 노출
- `App.jsx`: 중복 훅 호출 제거(버그), error banner 렌더링 추가

---

### 🔜 예정

**3단계 — useTodos.ts 성능 교정**
- `useCallback` deps에서 `todos` 제거 (toggleDone, deleteTodo, saveEdit)
- `AbortController` 추가 → 날짜 전환 시 race condition 방지
- `useMemo` 추가 → filteredTodos, counts 재계산 방지
- `addTodo` 실패 시 에러 메시지 표시

**4단계 — API 추상화**
- `frontend/lib/api.ts` 생성
- `todoApi.list()`, `.create()`, `.patch()`, `.delete()`로 fetch 통일

**5단계 — 성능 마무리**
- `React.memo(TodoItem)` — 3단계 완료 후 적용
- `useMemo(isToday)` — useDateNav.ts
- 버튼 Tailwind 클래스 상수화 — TodoItem.tsx
