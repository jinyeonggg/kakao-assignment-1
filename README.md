# Todo Next.js

날짜별 할 일을 관리하는 풀스택 웹 앱입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLite, Python

## 시작하기

### 백엔드 실행

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

백엔드: http://127.0.0.1:8000

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

프론트엔드: http://localhost:3000

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

## 주요 기능

- 날짜별 할 일 추가 / 수정 / 삭제
- 완료 체크 (낙관적 업데이트)
- 필터: 전체 / 진행 중 / 완료
- 날짜 네비게이션 (이전 / 다음 / 오늘)

## 프로젝트 구조

```
todo-nextjs/
├── frontend/
│   ├── app/
│   │   ├── todos/          # 메인 페이지
│   │   └── api/todos/      # Next.js → FastAPI 프록시
│   ├── components/         # UI 컴포넌트
│   ├── hooks/              # useTodos, useDateNav
│   ├── types/              # Todo 타입 정의
│   └── utils/              # 날짜 유틸
└── backend/
    ├── main.py             # FastAPI 라우터
    └── todos.db            # SQLite DB
```
