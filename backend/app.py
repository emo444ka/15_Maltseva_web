from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import List
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
import os
from pathlib import Path

app = FastAPI()

# Абсолютный путь к static
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Модель пользователя
class User(BaseModel):
    name: str
    email: str

# Инициализация БД
def init_db():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 name TEXT NOT NULL,
                 email TEXT NOT NULL UNIQUE)''')
    conn.commit()
    conn.close()

# Статические файлы
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Главная страница
@app.get("/", response_class=HTMLResponse)
async def read_index():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if not os.path.exists(index_path):
        return HTMLResponse("<h1>Главная страница</h1><p>index.html не найден</p>", status_code=404)
    return FileResponse(index_path)

# API пользователей
@app.get("/users", response_model=List[User])
async def get_all_users():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute("SELECT name, email FROM users")
    users = [{"name": row[0], "email": row[1]} for row in c.fetchall()]
    conn.close()
    return users

@app.post("/users", response_model=User)
async def create_user(user: User):
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (name, email) VALUES (?, ?)",
                 (user.name, user.email))
        conn.commit()
        return user
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email уже существует")
    finally:
        conn.close()

init_db()