import os
import sqlite3
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

DB_PATH = os.getenv("DATABASE_URL", "./todos.db")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS todos (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT    NOT NULL,
            done INTEGER NOT NULL DEFAULT 0,
            date TEXT    NOT NULL
        )
    """)
    conn.commit()
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    text: str = Field(..., max_length=100)
    date: str


class TodoUpdate(BaseModel):
    text: Optional[str] = Field(None, max_length=100)
    done: Optional[bool] = None


class TodoOut(BaseModel):
    id: int
    text: str
    done: bool
    date: str


def row_to_todo(row: sqlite3.Row) -> TodoOut:
    return TodoOut(id=row["id"], text=row["text"], done=bool(row["done"]), date=row["date"])


@app.get("/todos", response_model=list[TodoOut])
def get_todos(date: str):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM todos WHERE date = ? ORDER BY id ASC", (date,)
    ).fetchall()
    conn.close()
    return [row_to_todo(r) for r in rows]


@app.post("/todos", response_model=TodoOut, status_code=201)
def create_todo(body: TodoCreate):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO todos (text, done, date) VALUES (?, 0, ?)",
        (body.text, body.date),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM todos WHERE id = ?", (cur.lastrowid,)).fetchone()
    conn.close()
    return row_to_todo(row)


@app.patch("/todos/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, body: TodoUpdate):
    conn = get_db()
    row = conn.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Todo not found")

    updates = {}
    if body.text is not None:
        updates["text"] = body.text
    if body.done is not None:
        updates["done"] = int(body.done)

    if updates:
        set_clause = ", ".join(f"{k} = ?" for k in updates)
        conn.execute(
            f"UPDATE todos SET {set_clause} WHERE id = ?",
            (*updates.values(), todo_id),
        )
        conn.commit()

    row = conn.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    conn.close()
    return row_to_todo(row)


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    conn = get_db()
    row = conn.execute("SELECT id FROM todos WHERE id = ?", (todo_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Todo not found")
    conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()
    conn.close()
    return {"ok": True}
