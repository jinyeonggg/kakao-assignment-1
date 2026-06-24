# todo-nextjs

날짜별 할 일 관리 앱. Next.js 14 프론트엔드 + FastAPI 백엔드로 구성된 풀스택 프로젝트.
todo-react(localStorage)에서 마이그레이션된 버전이다.

## 실행 방법

**백엔드 (FastAPI)**
```bash
cd backend
# 첫 실행 시
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 이후 실행
venv\Scripts\activate
uvicorn main:app --reload
# → http://127.0.0.1:8000
```

**프론트엔드 (Next.js)**
```bash
cd frontend
npm install   # 첫 실행 시
npm run dev
# → http://localhost:3000
```

## 프로젝트 구조

```
todo-nextjs/
├── frontend/                  Next.js 14 (App Router)
│   ├── app/
│   │   ├── page.tsx           /todos로 리다이렉트
│   │   ├── layout.tsx
│   │   ├── todos/
│   │   │   ├── page.tsx       TodoPageClient 렌더
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx    스켈레톤 UI
│   │   └── api/todos/
│   │       ├── route.ts       GET / POST
│   │       └── [id]/route.ts  PATCH / DELETE
│   ├── components/
│   │   ├── TodoPageClient.tsx 상태 조합 + 레이아웃
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoInput.tsx
│   │   ├── DateNav.tsx
│   │   └── FilterTabs.tsx
│   ├── hooks/
│   │   ├── useTodos.ts        CRUD + 필터링 + 에러
│   │   └── useDateNav.ts      날짜 선택
│   ├── lib/
│   │   └── api.ts             fetch 추상화 레이어 (리팩토링 후 생성)
│   ├── types/todo.ts
│   ├── utils/dateUtils.ts
│   └── .env.local             FASTAPI_URL 설정
└── backend/
    ├── main.py                FastAPI 라우터 + SQLite
    ├── todos.db               SQLite DB (gitignore)
    └── .env                   DATABASE_URL, FRONTEND_URL
```

## 환경 변수

**frontend/.env.local**
```
FASTAPI_URL=http://127.0.0.1:8000
```

**backend/.env**
```
DATABASE_URL=./todos.db
FRONTEND_URL=http://localhost:3000
```

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/todos?date=YYYY-MM-DD` | 날짜별 목록 |
| POST | `/todos` | 추가 |
| PATCH | `/todos/{id}` | text 또는 done 수정 |
| DELETE | `/todos/{id}` | 삭제 |

Next.js API 라우트(`/api/todos/*`)가 FastAPI로 프록시한다.

## DB 스키마

```sql
CREATE TABLE todos (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT    NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  date TEXT    NOT NULL
);
```

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLite, Python
- **UI**: 퍼플 테마(`#672be0`), 한국어
